import { Injectable, NotImplementedException } from '@nestjs/common';
import { StorageAdapter, UploadResult } from '../interfaces/storage-adapter.interface';

/** OSS 对象存储适配器（待实现，生产环境使用） */
@Injectable()
export class OssStorageAdapter implements StorageAdapter {
  async upload(_file: Express.Multer.File, _subPath: string): Promise<UploadResult> {
    throw new NotImplementedException('OSS 存储适配器待实现');
  }

  async delete(_storagePath: string): Promise<void> {
    throw new NotImplementedException('OSS 存储适配器待实现');
  }

  getUrl(_storagePath: string): string {
    throw new NotImplementedException('OSS 存储适配器待实现');
  }
}
