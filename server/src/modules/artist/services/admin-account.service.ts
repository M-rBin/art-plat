import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { PrismaService } from '@/common/prisma.service';
import type { QueryAccountDto, UpdateAccountStatusDto } from '../dto/admin-account.dto';

/** 账号管理业务错误 */
export class AdminAccountError extends Error {
  constructor(
    readonly message: string,
    readonly code = 400,
  ) {
    super(message);
  }
}

/** 账号列表返回结构（含档案关联字段） */
interface AccountListItem {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  nationality: string | null;
  role: string;
  emailVerified: boolean;
  status: number;
  createTime: Date;
}

/** 艺术家账号管理服务（admin 端） */
@Injectable()
export class AdminAccountService {
  private readonly logger = new Logger(AdminAccountService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** 分页查询账号列表，关联 profile 取 avatarUrl/nationality */
  async page(dto: QueryAccountDto) {
    const { keyword, status, page = 1, pageSize = 10 } = dto;

    const where: Record<string, unknown> = {};

    if (status !== undefined) {
      where.status = status;
    }

    if (keyword?.trim()) {
      where.OR = [
        { email: { contains: keyword.trim() } },
        { name: { contains: keyword.trim() } },
      ];
    }

    const [total, accounts] = await Promise.all([
      this.prisma.artistAccount.count({ where }),
      this.prisma.artistAccount.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          status: true,
          createTime: true,
          profile: {
            select: {
              avatarUrl: true,
              nationality: true,
            },
          },
        },
        orderBy: { createTime: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const list: AccountListItem[] = accounts.map((a) => ({
      id: a.id,
      email: a.email,
      name: a.name,
      avatarUrl: a.profile?.avatarUrl ?? null,
      nationality: a.profile?.nationality ?? null,
      role: a.role,
      emailVerified: a.emailVerified,
      status: a.status,
      createTime: a.createTime,
    }));

    return { list, pagination: { page, pageSize, total } };
  }

  /** 切换账号状态（启用/禁用） */
  async updateStatus(id: number, dto: UpdateAccountStatusDto) {
    await this.assertExists(id);
    return this.prisma.artistAccount.update({
      where: { id },
      select: {
        id: true, email: true, name: true, role: true,
        emailVerified: true, status: true, createTime: true,
      },
      data: { status: dto.status },
    });
  }

  /** 重置密码：生成随机临时密码，bcrypt 哈希后写库，返回明文 */
  async resetPassword(id: number) {
    await this.assertExists(id);

    const tempPassword = this.generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 12);

    await this.prisma.artistAccount.update({
      where: { id },
      data: { password: hashed },
    });

    this.logger.log(`管理员重置密码: accountId=${id}`);
    return { id, tempPassword };
  }

  /** 生成 8 位随机临时密码（含字母+数字，使用加密安全随机数） */
  private generateTempPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let pwd = '';
    for (let i = 0; i < 8; i++) {
      pwd += chars[randomInt(0, chars.length)];
    }
    return pwd;
  }

  private async assertExists(id: number) {
    const account = await this.prisma.artistAccount.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!account) throw new AdminAccountError('账号不存在', 404);
  }
}
