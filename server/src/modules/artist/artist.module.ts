import { Module } from '@nestjs/common';
import { ArtistAuthController } from './controllers/auth.controller';
import { ProfileController } from './controllers/profile.controller';
import { DocumentController } from './controllers/document.controller';
import { QuestionController } from './controllers/question.controller';
import { AdminQuestionController } from './controllers/admin-question.controller';
import { AdminAccountController } from './controllers/admin-account.controller';
import { AdminProfileController } from './controllers/admin-profile.controller';
import { AdminDocumentController } from './controllers/admin-document.controller';
import { ArtistAuthService } from './services/artist-auth.service';
import { EmailService } from './services/email.service';
import { ProfileService } from './services/profile.service';
import { DocumentService } from './services/document.service';
import { QuestionService } from './services/question.service';
import { AdminQuestionService } from './services/admin-question.service';
import { AdminAccountService } from './services/admin-account.service';
import { AdminDocumentService } from './services/admin-document.service';
import { ArtistAuthGuard } from '@/common/guards/artist-auth.guard';
import { LocalStorageAdapter } from '@/modules/storage/adapters/local-storage.adapter';

/**
 * 艺术家域模块（website C 端 + admin 管理端）
 * STORAGE_ADAPTER 由全局 StorageModule 提供，无需重复注册
 */
@Module({
  controllers: [
    // C 端接口
    ArtistAuthController,
    ProfileController,
    DocumentController,
    QuestionController,
    // admin 管理接口
    AdminQuestionController,
    AdminAccountController,
    AdminProfileController,
    AdminDocumentController,
  ],
  providers: [
    ArtistAuthService,
    EmailService,
    ProfileService,
    DocumentService,
    QuestionService,
    AdminQuestionService,
    AdminAccountService,
    AdminDocumentService,
    ArtistAuthGuard,
    // profile.controller.ts 直接注入 LocalStorageAdapter 类，需保留
    LocalStorageAdapter,
  ],
  exports: [ArtistAuthService, EmailService, ProfileService, DocumentService],
})
export class ArtistModule {}

