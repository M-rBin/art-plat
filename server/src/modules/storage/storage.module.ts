import { Global, Module } from '@nestjs/common';
import { STORAGE_ADAPTER } from './interfaces/storage-adapter.interface';
import { LocalStorageAdapter } from './adapters/local-storage.adapter';

@Global()
@Module({
  providers: [
    {
      provide: STORAGE_ADAPTER,
      useClass: LocalStorageAdapter,
    },
  ],
  exports: [STORAGE_ADAPTER],
})
export class StorageModule {}
