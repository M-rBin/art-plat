import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis.service';
import { PrismaService } from '../prisma.service';

/**
 * 艺术家端鉴权守卫
 *
 * 校验 website C 端 JWT，与 Redis 中 artist:token 比对，
 * 通过后将 payload 写入 request.artist。
 * 仅在控制器显式 @UseGuards(ArtistAuthGuard) 时生效。
 */
@Injectable()
export class ArtistAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('未登录或 token 无效');
    }

    try {
      const payload = this.jwtService.verify(token);

      if (payload.isRefresh) {
        throw new UnauthorizedException('未登录或 token 无效');
      }

      const cachedToken = await this.redisService.get(
        `artist:token:${payload.userId}`,
      );
      if (!cachedToken || cachedToken !== token) {
        throw new UnauthorizedException('未登录或 token 无效');
      }

      const account = await this.prisma.artistAccount.findUnique({
        where: { id: payload.userId },
        select: { status: true, emailVerified: true },
      });
      if (!account || account.status !== 1 || !account.emailVerified) {
        await this.redisService.del(`artist:token:${payload.userId}`);
        throw new UnauthorizedException('未登录或 token 无效');
      }

      request.artist = payload;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('未登录或 token 无效');
    }
  }

  private extractToken(request: any): string | null {
    const authorization = request.headers['authorization'] || '';
    if (authorization.startsWith('Bearer ')) {
      return authorization.slice(7);
    }
    return null;
  }
}
