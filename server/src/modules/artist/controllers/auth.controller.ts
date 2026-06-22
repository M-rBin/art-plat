import { Controller, Post, Get, Body, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Public, Artist, ApiResult, ApiOkVoid } from '@/common/decorators';
import { BaseController } from '@/common/crud';
import { ArtistAuthGuard } from '@/common/guards/artist-auth.guard';
import { ArtistAuthService, ArtistAuthError } from '../services/artist-auth.service';
import { ArtistLoginDto } from '../dto/artist-login.dto';
import { ArtistRegisterDto } from '../dto/artist-register.dto';
import { ArtistLoginResultVo, ArtistRegisterResultVo, ArtistUserVo } from '../vo/artist-auth.vo';

/**
 * 艺术家认证控制器（website C 端）
 * 路由前缀 api/auth，与 website 前端 /api/auth/* 对齐。
 */
@ApiTags('艺术家认证')
@Controller('api/auth')
export class ArtistAuthController extends BaseController {
  constructor(private readonly artistAuthService: ArtistAuthService) {
    super();
  }

  /**
   * website 端约定成功 code=0（与 mock 一致），区别于 admin 端 code=200
   */
  private appOk<T>(data: T, message = 'success') {
    return { code: 0, data, message };
  }

  /**
   * 邮箱注册
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: '艺术家邮箱注册' })
  @ApiResult(ArtistRegisterResultVo)
  async register(@Body() dto: ArtistRegisterDto, @Req() req: Request) {
    const clientKey = req.ip || req.socket.remoteAddress || 'unknown';
    try {
      const result = await this.artistAuthService.register(dto.email, dto.password, clientKey);
      return this.appOk(result, '注册成功，请查收确认邮件');
    } catch (error) {
      if (error instanceof ArtistAuthError) {
        return this.fail(error.message, error.code);
      }
      throw error;
    }
  }

  /**
   * 邮箱确认
   */
  @Public()
  @Get('verify-email')
  @ApiOperation({ summary: '邮箱确认（激活账号）' })
  @ApiQuery({ name: 'token', required: true, description: '确认令牌' })
  @ApiOkVoid()
  async verifyEmail(@Query('token') token: string) {
    try {
      await this.artistAuthService.verifyEmail(token);
      return this.appOk(null, '邮箱确认成功，现在可以登录了');
    } catch (error) {
      if (error instanceof ArtistAuthError) {
        return this.fail(error.message, error.code);
      }
      throw error;
    }
  }

  /**
   * 邮箱密码登录
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: '艺术家邮箱密码登录' })
  @ApiResult(ArtistLoginResultVo)
  async login(@Body() dto: ArtistLoginDto, @Req() req: Request) {
    const clientKey = req.ip || req.socket.remoteAddress || 'unknown';
    try {
      const result = await this.artistAuthService.login(dto.email, dto.password, clientKey);
      return this.appOk(result, '登录成功');
    } catch (error) {
      if (error instanceof ArtistAuthError) {
        return this.fail(error.message, error.code);
      }
      throw error;
    }
  }

  /**
   * 获取当前登录用户
   * @Public() 跳过全局 Admin 鉴权；@UseGuards(ArtistAuthGuard) 执行 C 端 JWT 校验
   */
  @Public()
  @UseGuards(ArtistAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: '获取当前登录艺术家' })
  @ApiResult(ArtistUserVo)
  async me(@Artist('userId') userId: number) {
    const user = await this.artistAuthService.getMe(userId);
    if (!user) {
      return this.fail('未登录或 token 无效', 401);
    }
    return this.appOk(user);
  }

  /**
   * 退出登录
   * @Public() 跳过全局 Admin 鉴权；@UseGuards(ArtistAuthGuard) 执行 C 端 JWT 校验
   */
  @Public()
  @UseGuards(ArtistAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: '艺术家退出登录' })
  @ApiOkVoid()
  async logout(@Artist('userId') userId: number) {
    await this.artistAuthService.logout(userId);
    return this.appOk(null, '已退出登录');
  }
}
