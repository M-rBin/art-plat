import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { join, extname, resolve } from 'path';
import { mkdir, writeFile, unlink } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { StorageAdapter, UploadResult } from '../interfaces/storage-adapter.interface';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];

/** 本地磁盘存储适配器，写入 process.cwd()/uploads/ */
@Injectable()
export class LocalStorageAdapter implements StorageAdapter {
  private readonly logger = new Logger(LocalStorageAdapter.name);
  private readonly uploadRoot = join(process.cwd(), 'uploads');

  async upload(file: Express.Multer.File, subPath: string): Promise<UploadResult> {
    const ext = extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new BadRequestException(`不允许的文件类型: ${ext}`);
    }

    const fileName = `${uuidv4()}${ext}`;
    const storagePath = `${subPath}/${fileName}`;
    const absoluteDir = this.assertSafePath(subPath);

    await mkdir(absoluteDir, { recursive: true });
    await writeFile(join(absoluteDir, fileName), file.buffer);

    this.logger.debug(`文件已写入: ${storagePath}`);

    return {
      storagePath,
      url: `/uploads/${storagePath}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }

  async delete(storagePath: string): Promise<void> {
    const absolutePath = this.assertSafePath(storagePath);
    try {
      await unlink(absolutePath);
      this.logger.debug(`文件已删除: ${storagePath}`);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        this.logger.warn(`文件不存在，跳过删除: ${storagePath}`);
        return;
      }
      throw err;
    }
  }

  getUrl(storagePath: string): string {
    this.assertSafePath(storagePath);
    return `/uploads/${storagePath}`;
  }

  /** 校验路径未逃逸出 uploadRoot，防止路径遍历攻击 */
  private assertSafePath(relativePath: string): string {
    const abs = resolve(this.uploadRoot, relativePath);
    if (!abs.startsWith(this.uploadRoot + '/')) {
      throw new BadRequestException('非法存储路径');
    }
    return abs;
  }
}
