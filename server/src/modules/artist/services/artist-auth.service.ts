import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '@/common/prisma.service';
import { RedisService } from '@/common/redis.service';
import { EmailService } from './email.service';
import { ArtistUserVo } from '../vo/artist-auth.vo';

/** 登录业务失败（由控制器转为 fail 响应，不抛 HTTP 异常） */
export class ArtistAuthError extends Error {
  constructor(
    readonly message: string,
    readonly code = 401,
  ) {
    super(message);
  }
}

/**
 * 艺术家认证服务
 * 负责 website C 端邮箱密码登录、当前用户查询与退出。
 */
@Injectable()
export class ArtistAuthService {
  private readonly logger = new Logger(ArtistAuthService.name);

  /** 用于账号不存在时的恒定耗时 bcrypt 比对（不含真实密码） */
  private static readonly DUMMY_BCRYPT =
    '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31LG';

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  private static readonly VERIFY_TOKEN_TTL = 86400;
  private static readonly VERIFY_KEY_PREFIX = 'artist:email:verify:';
  private static readonly PENDING_EMAIL_PREFIX = 'artist:email:pending:';

  /**
   * 邮箱注册：限流 → 校验 → 哈希密码 → Redis 写 token → 发确认邮件
   */
  async register(email: string, password: string, clientKey: string): Promise<object> {
    await this.assertRegisterRateLimit(clientKey);

    const normalizedEmail = email.trim().toLowerCase();

    const existingAccount = await this.prisma.artistAccount.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, emailVerified: true },
    });
    if (existingAccount && existingAccount.emailVerified) {
      throw new ArtistAuthError('该邮箱已注册，请直接登录', 409);
    }

    const hasPending = await this.hasPendingToken(normalizedEmail);
    if (hasPending) {
      throw new ArtistAuthError('该邮箱已提交注册，请查收确认邮件', 409);
    }

    const passwordHash = await this.hashPassword(password);
    const token = uuidv4();
    const redisKey = `${ArtistAuthService.VERIFY_KEY_PREFIX}${token}`;
    const pendingEmailKey = `${ArtistAuthService.PENDING_EMAIL_PREFIX}${normalizedEmail}`;
    const payload = JSON.stringify({ email: normalizedEmail, passwordHash });

    await this.redis.set(redisKey, payload, ArtistAuthService.VERIFY_TOKEN_TTL);
    await this.redis.set(pendingEmailKey, token, ArtistAuthService.VERIFY_TOKEN_TTL);

    const baseUrl = this.configService.get<string>('WEBSITE_BASE_URL', 'http://localhost:5173');
    const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

    await this.emailService.sendVerificationEmail(normalizedEmail, verifyUrl);

    this.logger.log(`注册确认 token 已生成: email=${normalizedEmail}`);
    return {};
  }

  /**
   * 邮箱确认：原子消费 token → 创建账号 → 清理反向索引
   */
  async verifyEmail(token: string): Promise<void> {
    if (!token || !token.trim()) {
      throw new ArtistAuthError('确认链接无效', 400);
    }

    const redisKey = `${ArtistAuthService.VERIFY_KEY_PREFIX}${token.trim()}`;
    const redis = this.redis.getClient();

    // 原子 get + del，确保 token 只被消费一次
    const data = await redis.getdel(redisKey);

    if (!data) {
      throw new ArtistAuthError('确认链接无效或已过期', 404);
    }

    const { email, passwordHash } = JSON.parse(data) as { email: string; passwordHash: string };

    const existingAccount = await this.prisma.artistAccount.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });
    if (existingAccount && existingAccount.emailVerified) {
      throw new ArtistAuthError('该邮箱已完成确认，请直接登录', 409);
    }

    try {
      if (existingAccount) {
        await this.prisma.artistAccount.update({
          where: { id: existingAccount.id },
          data: { password: passwordHash, emailVerified: true },
        });
      } else {
        await this.prisma.artistAccount.create({
          data: {
            email,
            password: passwordHash,
            emailVerified: true,
          },
        });
      }
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new ArtistAuthError('该邮箱已完成确认，请直接登录', 409);
      }
      throw err;
    }

    // 清理反向索引（失败不影响主流程）
    try {
      await this.redis.del(`${ArtistAuthService.PENDING_EMAIL_PREFIX}${email}`);
    } catch (err) {
      this.logger.warn(`清理 pending email key 失败: ${email}`, err);
    }

    this.logger.log(`邮箱确认成功: email=${email}`);
  }

  /**
   * 邮箱密码登录
   * @param clientKey 客户端标识（IP），用于登录限流
   */
  async login(email: string, password: string, clientKey: string) {
    await this.assertLoginRateLimit(clientKey);

    const normalizedEmail = email.trim().toLowerCase();

    const account = await this.prisma.artistAccount.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        avatar: true,
        role: true,
        emailVerified: true,
        status: true,
      },
    });

    if (!account) {
      await bcrypt.compare(password, ArtistAuthService.DUMMY_BCRYPT);
      throw new ArtistAuthError('邮箱或密码错误');
    }

    if (account.status === 0) {
      await bcrypt.compare(password, account.password);
      throw new ArtistAuthError('邮箱或密码错误');
    }

    if (!account.emailVerified) {
      await bcrypt.compare(password, account.password);
      throw new ArtistAuthError('邮箱尚未确认，请先查收确认邮件');
    }

    const valid = await bcrypt.compare(password, account.password);
    if (!valid) {
      throw new ArtistAuthError('邮箱或密码错误');
    }

    const tokenPayload = {
      userId: account.id,
      email: account.email,
      role: account.role,
    };

    const accessExpire = Number(this.configService.get<number>('JWT_ACCESS_EXPIRE', 7200));
    const token = this.jwtService.sign(tokenPayload, { expiresIn: accessExpire });
    await this.redis.set(`artist:token:${account.id}`, token, accessExpire);

    const user = this.toUserVo(account);
    this.logger.log(`艺术家登录成功: userId=${account.id}`);

    return { token, user };
  }

  /**
   * 获取当前登录艺术家信息
   */
  async getMe(userId: number): Promise<ArtistUserVo | null> {
    const account = await this.prisma.artistAccount.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
      },
    });

    if (!account || account.status === 0 || !account.emailVerified) {
      return null;
    }

    return this.toUserVo(account);
  }

  /**
   * 退出登录，清除 Redis 中的 token
   */
  async logout(userId: number): Promise<void> {
    await this.redis.del(`artist:token:${userId}`);
  }

  /**
   * 生成密码哈希（注册流程复用）
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /** 登录限流：同一客户端每分钟最多 5 次尝试（INCR + EXPIRE 原子执行） */
  private async assertLoginRateLimit(clientKey: string): Promise<void> {
    const redis = this.redis.getClient();
    const key = `artist:login:limit:${clientKey}`;
    const count = (await redis.eval(
      `local c = redis.call('INCR', KEYS[1])
       if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
       return c`,
      1,
      key,
      60,
    )) as number;
    if (count > 5) {
      throw new ArtistAuthError('请求过于频繁，请稍后再试', 429);
    }
  }

  /** 注册限流：同一客户端每分钟最多 3 次（防邮件轰炸） */
  private async assertRegisterRateLimit(clientKey: string): Promise<void> {
    const redis = this.redis.getClient();
    const key = `artist:register:limit:${clientKey}`;
    const count = (await redis.eval(
      `local c = redis.call('INCR', KEYS[1])
       if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
       return c`,
      1,
      key,
      60,
    )) as number;
    if (count > 3) {
      throw new ArtistAuthError('请求过于频繁，请稍后再试', 429);
    }
  }

  /** O(1) 检查是否有同邮箱的 pending verify token */
  private async hasPendingToken(email: string): Promise<boolean> {
    const key = `${ArtistAuthService.PENDING_EMAIL_PREFIX}${email}`;
    const val = await this.redis.get(key);
    return !!val;
  }

  private toUserVo(account: {
    id: number;
    email: string;
    name: string | null;
    avatar: string | null;
    role: string;
  }): ArtistUserVo {
    return {
      id: account.id,
      email: account.email,
      name: account.name || account.email.split('@')[0] || 'User',
      avatar: account.avatar || '',
      role: account.role,
    };
  }
}
