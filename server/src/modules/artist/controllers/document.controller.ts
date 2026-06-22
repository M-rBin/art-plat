import {
  Controller, Get, Post, Delete, Query, Param,
  ParseIntPipe, UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiConsumes, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Artist } from '@/common/decorators';
import { BaseController } from '@/common/crud';
import { ArtistAuthGuard } from '@/common/guards/artist-auth.guard';
import { DocumentService, DocumentError } from '../services/document.service';

@ApiTags('艺术家资料文件')
@Controller('api/documents')
export class DocumentController extends BaseController {
  constructor(private readonly documentService: DocumentService) {
    super();
  }

  private appOk<T>(data: T, message = 'success') {
    return { code: 0, data, message };
  }

  @UseGuards(ArtistAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: '上传资料文件（multipart/form-data）' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async upload(
    @Artist('userId') userId: number,
    @UploadedFile() file: Express.Multer.File,
    @Query('category') category: string,
    @Query('profileId', ParseIntPipe) profileId: number,
  ) {
    try {
      const result = await this.documentService.uploadDocument(userId, profileId, category, file);
      return this.appOk(result, '上传成功');
    } catch (error) {
      if (error instanceof DocumentError) {
        return this.fail(error.message, error.code);
      }
      throw error;
    }
  }

  @UseGuards(ArtistAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: '删除资料文件' })
  @ApiParam({ name: 'id', description: '资料记录 ID', type: Number })
  async remove(
    @Artist('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.documentService.deleteDocument(userId, id);
      return this.appOk(null, '删除成功');
    } catch (error) {
      if (error instanceof DocumentError) {
        return this.fail(error.message, error.code);
      }
      throw error;
    }
  }

  @UseGuards(ArtistAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: '资料文件列表' })
  @ApiQuery({ name: 'profileId', required: true, description: '档案 ID', type: Number })
  @ApiQuery({ name: 'category', required: false, description: '分类筛选' })
  async list(
    @Artist('userId') userId: number,
    @Query('profileId', ParseIntPipe) profileId: number,
    @Query('category') category?: string,
  ) {
    try {
      const result = await this.documentService.listDocuments(userId, profileId, category);
      return this.appOk(result);
    } catch (error) {
      if (error instanceof DocumentError) {
        return this.fail(error.message, error.code);
      }
      throw error;
    }
  }
}