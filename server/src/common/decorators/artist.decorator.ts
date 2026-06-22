import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 当前艺术家用户参数装饰器
 *
 * 从请求对象上取出 ArtistAuthGuard 鉴权通过后写入的 request.artist（JWT payload）。
 */
export const Artist = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const artist = request.artist;
    return data ? artist?.[data] : artist;
  },
);
