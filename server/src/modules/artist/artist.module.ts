import { Module } from '@nestjs/common';
import { ArtistAuthController } from './controllers/auth.controller';
import { ProfileController } from './controllers/profile.controller';
import { DocumentController } from './controllers/document.controller';
import { QuestionController } from './controllers/question.controller';
import { ArtistAuthService } from './services/artist-auth.service';
import { EmailService } from './services/email.service';
import { ProfileService } from './services/profile.service';
import { DocumentService } from './services/document.service';
import { QuestionService } from './services/question.service';
import { ArtistAuthGuard } from '@/common/guards/artist-auth.guard';
import { LocalStorageAdapter } from '@/modules/storage/adapters/local-storage.adapter';

/**
 * 艺术家域模块（website C 端）
 */
@Module({
  controllers: [ArtistAuthController, ProfileController, DocumentController, QuestionController],
  providers: [ArtistAuthService, EmailService, ProfileService, DocumentService, QuestionService, ArtistAuthGuard, LocalStorageAdapter],
  exports: [ArtistAuthService, EmailService, ProfileService, DocumentService],
})
export class ArtistModule {}
