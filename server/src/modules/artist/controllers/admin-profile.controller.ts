import { Controller, Get, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BaseController } from '@/common/crud';
import { ApiOkResponse } from '@nestjs/swagger';
import { ProfileService, ProfileError } from '../services/profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

/**
 * 艺术家档案管理控制器（admin 端）
 * 路由前缀 admin/artist/accounts/:id/profile，由全局 AuthGuard 鉴权
 * 管理员可操作任意艺术家档案，无归属校验
 */
@ApiTags('艺术家档案管理（admin）')
@ApiBearerAuth()
@Controller('admin/artist/accounts/:id/profile')
export class AdminProfileController extends BaseController {
  constructor(private readonly profileService: ProfileService) {
    super();
  }

  /** 读取指定艺术家档案（首次访问自动创建空档案） */
  @Get()
  @ApiOperation({ summary: '读取艺术家档案（admin，无归属校验）' })
  @ApiParam({ name: 'id', type: Number, description: '账号 ID' })
  @ApiOkResponse({ description: '档案数据（结构与 C 端 GET /api/profile 一致）' })
  async getProfile(@Param('id', ParseIntPipe) accountId: number) {
    const profile = await this.profileService.findOrCreate(accountId);
    return this.ok(profile);
  }

  /** 更新指定艺术家档案（含代理画廊全量替换） */
  @Put()
  @ApiOperation({ summary: '更新艺术家档案（admin，无归属校验）' })
  @ApiParam({ name: 'id', type: Number, description: '账号 ID' })
  @ApiOkResponse({ description: '更新后的档案数据' })
  async updateProfile(
    @Param('id', ParseIntPipe) accountId: number,
    @Body() body: UpdateProfileDto,
  ) {
    try {
      const profile = await this.profileService.update(accountId, body);
      return this.ok(profile, '保存成功');
    } catch (err) {
      if (err instanceof ProfileError) return this.fail(err.message, err.code);
      throw err;
    }
  }
}
