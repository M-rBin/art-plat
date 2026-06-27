import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import { STORAGE_ADAPTER, StorageAdapter } from '@modules/storage/interfaces/storage-adapter.interface';

/** 文件管理业务错误（admin 端） */
export class AdminDocumentError extends Error {
  constructor(
    readonly message: string,
    readonly code = 400,
  ) {
    super(message);
  }
}

/** 艺术家文件管理服务（admin 端，无归属校验） */
@Injectable()
export class AdminDocumentService {
  private readonly logger = new Logger(AdminDocumentService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_ADAPTER) private readonly storage: StorageAdapter,
  ) {}

  /** 查询指定账号的资料文件列表，可按分类过滤 */
  async listByAccount(accountId: number, category?: string) {
    const profile = await this.prisma.artistProfile.findUnique({
      where: { accountId },
      select: { id: true },
    });

    if (!profile) return [];

    const where: Record<string, unknown> = { profileId: profile.id };
    if (category) where.category = category;

    const docs = await this.prisma.artistDocument.findMany({
      where,
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { createTime: 'asc' }],
      take: 200,
    });

    return docs.map((doc) => ({
      id: doc.id,
      category: doc.category,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      url: this.storage.getUrl(doc.storagePath),
      sortOrder: doc.sortOrder,
      createTime: doc.createTime,
    }));
  }

  /** 删除指定文件（admin 无归属校验，按 docId 直接删除） */
  async remove(docId: number) {
    const doc = await this.prisma.artistDocument.findUnique({
      where: { id: docId },
      select: { id: true, storagePath: true },
    });

    if (!doc) throw new AdminDocumentError('资料记录不存在', 404);

    await this.storage.delete(doc.storagePath).catch((err) => {
      this.logger.warn(`存储文件删除失败，继续删库记录: docId=${docId}, ${err}`);
    });

    await this.prisma.artistDocument.delete({ where: { id: docId } });
    this.logger.log(`管理员删除资料: docId=${docId}`);
  }
}
