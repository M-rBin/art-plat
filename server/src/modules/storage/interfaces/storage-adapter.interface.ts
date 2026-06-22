/** 文件上传结果 */
export interface UploadResult {
  /** 存储相对路径，如 portrait/42/uuid.jpg */
  storagePath: string;
  /** 可访问 URL，如 /uploads/portrait/42/uuid.jpg */
  url: string;
  /** 原始文件名 */
  originalName: string;
  /** MIME 类型 */
  mimeType: string;
  /** 文件大小（字节） */
  fileSize: number;
}

/** 文件存储适配器接口 */
export interface StorageAdapter {
  /** 上传文件 */
  upload(file: Express.Multer.File, subPath: string): Promise<UploadResult>;
  /** 删除文件 */
  delete(storagePath: string): Promise<void>;
  /** 获取文件访问 URL */
  getUrl(storagePath: string): string;
}

/** 依赖注入 Token */
export const STORAGE_ADAPTER = 'STORAGE_ADAPTER';
