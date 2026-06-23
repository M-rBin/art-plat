import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import { STORAGE_ADAPTER, StorageAdapter } from '@modules/storage/interfaces/storage-adapter.interface';

const VALID_CATEGORIES = ['portrait', 'studio', 'cv', 'portfolio', 'media'] as const;
type DocumentCategory = typeof VALID_CATEGORIES[number];

const ALLOWED_MIMES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export class DocumentError extends Error {
  constructor(
    readonly message: string,
    readonly code = 400,
  ) {
    super(message);
  }
}

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(STORAGE_ADAPTER) private storage: StorageAdapter,
  ) {}

  /** 上传资料文件 */
  async uploadDocument(
    userId: number,
    profileId: number,
    category: string,
    file: Express.Multer.File,
  ) {
    this.validateCategory(category);
    this.validateFile(file);
    await this.assertOwnership(userId, profileId);

    const subPath = `${category}/${profileId}`;
    const result = await this.storage.upload(file, subPath);

    const doc = await this.prisma.artistDocument.create({
      data: {
        profileId,
        category,
        fileName: this.sanitizeFileName(file.originalname),
        fileSize: file.size,
        mimeType: file.mimetype,
        storagePath: result.storagePath,
      },
    });

    this.logger.log(`资料上传成功: docId=${doc.id}, category=${category}`);

    return {
      id: doc.id,
      category: doc.category,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      url: result.url,
    };
  }

  /** 删除资料文件 */
  async deleteDocument(userId: number, documentId: number): Promise<void> {
    const doc = await this.prisma.artistDocument.findUnique({
      where: { id: documentId },
      include: { profile: { select: { accountId: true } } },
    });

    if (!doc) {
      throw new DocumentError('资料记录不存在', 404);
    }

    if (doc.profile.accountId !== userId) {
      throw new DocumentError('无权操作此档案', 403);
    }

    await this.storage.delete(doc.storagePath);
    await this.prisma.artistDocument.delete({ where: { id: documentId } });

    this.logger.log(`资料删除成功: docId=${documentId}`);
  }

  /** 资料列表（按分类+排序） */
  async listDocuments(userId: number, profileId: number, category?: string) {
    await this.assertOwnership(userId, profileId);

    if (category) {
      this.validateCategory(category);
    }

    const where: any = { profileId };
    if (category) {
      where.category = category;
    }

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

  private validateCategory(category: string): asserts category is DocumentCategory {
    if (!VALID_CATEGORIES.includes(category as DocumentCategory)) {
      throw new DocumentError('无效的资料分类');
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new DocumentError('请选择要上传的文件');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new DocumentError('文件大小超过 10MB 限制');
    }
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new DocumentError('文件格式不支持，仅允许 PNG/JPG/JPEG/PDF');
    }
    if (!this.verifyMagicBytes(file.buffer)) {
      throw new DocumentError('文件格式不支持，仅允许 PNG/JPG/JPEG/PDF');
    }
  }

  /** 通过 magic bytes 验证文件真实类型，防止 MIME 伪造 */
  private verifyMagicBytes(buffer: Buffer): boolean {
    if (!buffer || buffer.length < 4) return false;
    // PNG: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;
    // JPEG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;
    // PDF: 25 50 44 46 (%PDF)
    if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) return true;
    return false;
  }

  /** 净化文件名，防止路径注入和 XSS */
  private sanitizeFileName(name: string): string {
    // Multer 用 Latin-1 解析 multipart 文件名，UTF-8 中文会变成乱码
    // 只在含非 ASCII 字节时尝试 re-decode，且结果含替换字符时回退原值
    let decoded = name;
    if (/[\x80-\xFF]/.test(name)) {
      const candidate = Buffer.from(name, 'latin1').toString('utf8');
      decoded = candidate.includes('�') ? name : candidate;
    }
    return decoded
      .replace(/[/\\<>"'`]/g, '_')
      .replace(/\.\./g, '_')
      .replace(/\x00/g, '')
      .slice(0, 200);
  }

  private async assertOwnership(userId: number, profileId: number): Promise<void> {
    const profile = await this.prisma.artistProfile.findFirst({
      where: { id: profileId, accountId: userId },
      select: { id: true },
    });
    if (!profile) {
      throw new DocumentError('无权操作此档案', 403);
    }
  }
}