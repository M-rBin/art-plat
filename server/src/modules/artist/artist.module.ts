import { Module } from '@nestjs/common';
import { ArtistAuthController } from './controllers/auth.controller';
import { ProfileController } from './controllers/profile.controller';
import { DocumentController } from './controllers/document.controller';
import { ArtistAuthService } from './services/artist-auth.service';
import { EmailService } from './services/email.service';
import { ProfileService } from './services/profile.service';
import { DocumentService } from './services/document.service';
import { ArtistAuthGuard } from '@/common/guards/artist-auth.guard';
import { LocalStorageAdapter } from '@/modules/storage/adapters/local-storage.adapter';

/**
 * 艺术家域模块（website C 端）
 */
@Module({
  controllers: [ArtistAuthController, ProfileController, DocumentController],
  providers: [ArtistAuthService, EmailService, ProfileService, DocumentService, ArtistAuthGuard, LocalStorageAdapter],
  exports: [ArtistAuthService, EmailService, ProfileService, DocumentService],
})
export class ArtistModule {}
