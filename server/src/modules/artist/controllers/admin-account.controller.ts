import { Controller, Get, Put, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BaseController } from '@/common/crud';
import { ApiResult, ApiPageResult } from '@/common/decorators';
import { AdminAccountService, AdminAccountError } from '../services/admin-account.service';
import { QueryAccountDto, UpdateAccountStatusDto } from '../dto/admin-account.dto';
import { AdminAccountVo, ResetPasswordVo } from '../vo/admin-account.vo';

/**
 * 艺术家账号管理控制器（admin 端）
 * 路由前缀 admin/artist/accounts，由全局 AuthGuard 鉴权
 */
@ApiTags('艺术家账号管理（admin）')
@ApiBearerAuth()
@Controller('admin/artist/accounts')
export class AdminAccountController extends BaseController {
  constructor(private readonly accountService: AdminAccountService) {
    super();
  }

  /** 分页查询艺术家账号列表 */
  @Get()
  @ApiOperation({ summary: '艺术家账号列表（分页，含档案 avatarUrl/nationality）' })
  @ApiPageResult(AdminAccountVo)
  async list(@Query() dto: QueryAccountDto) {
    const data = await this.accountService.page(dto);
    return this.ok(data);
  }

  /** 切换账号状态（启用/禁用） */
  @Put(':id/status')
  @ApiOperation({ summary: '切换账号状态' })
  @ApiParam({ name: 'id', type: Number, description: '账号 ID' })
  @ApiResult(AdminAccountVo)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccountStatusDto,
  ) {
    try {
      const data = await this.accountService.updateStatus(id, dto);
      return this.ok(data, '状态更新成功');
    } catch (err) {
      if (err instanceof AdminAccountError) return this.fail(err.message, err.code);
      throw err;
    }
  }

  /** 重置密码（生成临时密码，明文仅此一次返回） */
  @Post(':id/reset-password')
  @ApiOperation({ summary: '重置艺术家密码（返回临时密码明文）' })
  @ApiParam({ name: 'id', type: Number, description: '账号 ID' })
  @ApiResult(ResetPasswordVo)
  async resetPassword(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.accountService.resetPassword(id);
      return this.ok(data, '密码重置成功');
    } catch (err) {
      if (err instanceof AdminAccountError) return this.fail(err.message, err.code);
      throw err;
    }
  }
}
