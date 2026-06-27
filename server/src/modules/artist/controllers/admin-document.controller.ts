import { Controller, Get, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BaseController } from '@/common/crud';
import { ApiOkVoid } from '@/common/decorators';
import { AdminDocumentService, AdminDocumentError } from '../services/admin-document.service';
import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

class QueryDocumentDto {
  @ApiPropertyOptional({ description: '分类筛选', enum: ['portrait', 'studio', 'cv', 'portfolio', 'media'] })
  @IsOptional()
  @IsIn(['portrait', 'studio', 'cv', 'portfolio', 'media'])
  category?: string;
}

/**
 * 艺术家文件管理控制器（admin 端）
 * 管理员可查看/删除任意艺术家的资料文件，无归属校验
 */
@ApiTags('艺术家文件管理（admin）')
@ApiBearerAuth()
@Controller('admin/artist')
export class AdminDocumentController extends BaseController {
  constructor(private readonly documentService: AdminDocumentService) {
    super();
  }

  /** 查询指定账号的资料文件列表 */
  @Get('accounts/:id/documents')
  @ApiOperation({ summary: '艺术家资料文件列表（admin，无归属校验）' })
  @ApiParam({ name: 'id', type: Number, description: '账号 ID' })
  @ApiQuery({ name: 'category', required: false, enum: ['portrait', 'studio', 'cv', 'portfolio', 'media'] })
  @ApiOkVoid()
  async list(
    @Param('id', ParseIntPipe) accountId: number,
    @Query() dto: QueryDocumentDto,
  ) {
    const data = await this.documentService.listByAccount(accountId, dto.category);
    return this.ok(data);
  }

  /** 删除指定资料文件 */
  @Delete('documents/:docId')
  @ApiOperation({ summary: '删除资料文件（admin，无归属校验）' })
  @ApiParam({ name: 'docId', type: Number, description: '资料文件 ID' })
  @ApiOkVoid()
  async remove(@Param('docId', ParseIntPipe) docId: number) {
    try {
      await this.documentService.remove(docId);
      return this.ok(null, '删除成功');
    } catch (err) {
      if (err instanceof AdminDocumentError) return this.fail(err.message, err.code);
      throw err;
    }
  }
}
