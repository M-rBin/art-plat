import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BaseController } from '@/common/crud';
import { ApiResult, ApiOkVoid, ApiPageResult } from '@/common/decorators';
import { AdminQuestionService, AdminQuestionError } from '../services/admin-question.service';
import {
  QueryQuestionDto,
  CreateQuestionDto,
  UpdateQuestionDto,
  UpdateQuestionStatusDto,
} from '../dto/admin-question.dto';
import { AdminQuestionVo } from '../vo/admin-question.vo';

/**
 * 问题库管理控制器（admin 端）
 * 路由前缀 admin/artist/questions，由全局 AuthGuard 鉴权
 */
@ApiTags('问题库管理（admin）')
@ApiBearerAuth()
@Controller('admin/artist/questions')
export class AdminQuestionController extends BaseController {
  constructor(private readonly questionService: AdminQuestionService) {
    super();
  }

  /** 分页查询问题列表 */
  @Get()
  @ApiOperation({ summary: '问题列表（分页，支持关键词/状态过滤）' })
  @ApiPageResult(AdminQuestionVo)
  async list(@Query() dto: QueryQuestionDto) {
    const data = await this.questionService.page(dto);
    return this.ok(data);
  }

  /** 新增问题 */
  @Post()
  @ApiOperation({ summary: '新增问题' })
  @ApiResult(AdminQuestionVo)
  async create(@Body() dto: CreateQuestionDto) {
    const data = await this.questionService.create(dto);
    return this.ok(data, '新增成功');
  }

  /** 编辑问题 */
  @Put(':id')
  @ApiOperation({ summary: '编辑问题' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResult(AdminQuestionVo)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
  ) {
    try {
      const data = await this.questionService.update(id, dto);
      return this.ok(data, '更新成功');
    } catch (err) {
      if (err instanceof AdminQuestionError) return this.fail(err.message, err.code);
      throw err;
    }
  }

  /** 切换状态 */
  @Put(':id/status')
  @ApiOperation({ summary: '切换问题状态（启用/禁用）' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResult(AdminQuestionVo)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionStatusDto,
  ) {
    try {
      const data = await this.questionService.updateStatus(id, dto.status);
      return this.ok(data, '状态更新成功');
    } catch (err) {
      if (err instanceof AdminQuestionError) return this.fail(err.message, err.code);
      throw err;
    }
  }

  /** 删除问题 */
  @Delete(':id')
  @ApiOperation({ summary: '删除问题' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkVoid()
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.questionService.remove(id);
      return this.ok(null, '删除成功');
    } catch (err) {
      if (err instanceof AdminQuestionError) return this.fail(err.message, err.code);
      throw err;
    }
  }
}
