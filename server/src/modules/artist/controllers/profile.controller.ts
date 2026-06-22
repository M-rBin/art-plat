import { Controller, Get, Put, Post, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Artist } from '@/common/decorators';
import { BaseController } from '@/common/crud';
import { ArtistAuthGuard } from '@/common/guards/artist-auth.guard';
import { ProfileService, ProfileError } from '../services/profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { LocalStorageAdapter } from '@/modules/storage/adapters/local-storage.adapter';

@ApiTags('艺术家档案')
@Controller('api/profile')
export class ProfileController extends BaseController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly storage: LocalStorageAdapter,
  ) {
    super();
  }

  private appOk<T>(data: T, message = 'success') {
    return { code: 0, data, message };
  }

  @UseGuards(ArtistAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: '查询当前艺术家档案（首次访问自动创建）' })
  async getProfile(@Artist('userId') userId: number) {
    const profile = await this.profileService.findOrCreate(userId);
    return this.appOk(profile);
  }

  @UseGuards(ArtistAuthGuard)
  @ApiBearerAuth()
  @Put()
  @ApiOperation({ summary: '更新档案（含代理画廊全量替换）' })
  async updateProfile(
    @Artist('userId') userId: number,
    @Body() body: UpdateProfileDto,
  ) {
    try {
      const profile = await this.profileService.update(userId, body);
      return this.appOk(profile, '保存成功');
    } catch (error) {
      if (error instanceof ProfileError) {
        return this.fail(error.message, error.code);
      }
      throw error;
    }
  }

  @UseGuards(ArtistAuthGuard)
  @ApiBearerAuth()
  @Post('avatar')
  @ApiOperation({ summary: '上传头像（multipart/form-data，字段名 file）' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadAvatar(
    @Artist('userId') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return this.fail('请选择文件', 400);
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return this.fail('仅支持 JPG、PNG、WebP 格式', 400);
    }
    try {
      const existing = await this.profileService.findOrCreate(userId);
      const result = await this.storage.upload(file, `avatars/${userId}`);
      if (existing.avatarUrl?.startsWith('/uploads/')) {
        const oldPath = existing.avatarUrl.replace('/uploads/', '');
        await this.storage.delete(oldPath).catch(() => {});
      }
      const profile = await this.profileService.update(userId, { avatarUrl: result.url });
      return this.appOk({ avatarUrl: result.url, profile }, '头像上传成功');
    } catch (error) {
      if (error instanceof ProfileError) {
        return this.fail(error.message, error.code);
      }
      throw error;
    }
  }
}
