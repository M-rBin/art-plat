import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

/** 档案响应结构 */
export interface ProfileData {
  id: number;
  displayName: string | null;
  title: string | null;
  nationality: string | null;
  city: string | null;
  avatarUrl: string | null;
  personal: {
    firstName: string | null;
    lastName: string | null;
    nationality: string | null;
    birthYear: string | null;
    birthPlace: string | null;
    residence: string | null;
    studyAbroad: string | null;
    education: string | null;
  };
  contact: {
    website: string | null;
    instagram: string | null;
    xiaohongshu: string | null;
    wechat: string | null;
    email: string | null;
    phone: string | null;
  };
  quoteParagraphs: any;
  galleries: Array<{
    id: number;
    name: string | null;
    location: string | null;
    logoUrl: string | null;
    sortOrder: number;
  }>;
}

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private prisma: PrismaService) {}

  /** 查询档案，不存在则自动创建空档案 */
  async findOrCreate(accountId: number): Promise<ProfileData> {
    let profile = await this.prisma.artistProfile.findUnique({
      where: { accountId },
      include: { galleries: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!profile) {
      profile = await this.prisma.artistProfile.create({
        data: { accountId },
        include: { galleries: { orderBy: { sortOrder: 'asc' } } },
      });
      this.logger.log(`自动创建空档案: accountId=${accountId}`);
    }

    return this.toProfileData(profile);
  }

  /** 更新档案 + 全量替换画廊（事务） */
  async update(accountId: number, data: UpdateProfileDto): Promise<ProfileData> {
    if (data.galleries && data.galleries.length > 20) {
      throw new ProfileError('代理画廊数量不能超过 20 条', 400);
    }

    const existing = await this.prisma.artistProfile.findUnique({
      where: { accountId },
      select: { id: true },
    });
    if (!existing) {
      throw new ProfileError('档案不存在', 404);
    }

    const profileId = existing.id;

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        await tx.artistProfile.update({
          where: { id: profileId },
          data: {
            displayName: data.displayName,
            title: data.title,
            nationality: data.personal?.nationality ?? data.nationality,
            city: data.city,
            avatarUrl: data.avatarUrl,
            firstName: data.personal?.firstName,
            lastName: data.personal?.lastName,
            birthYear: data.personal?.birthYear,
            birthPlace: data.personal?.birthPlace,
            residence: data.personal?.residence,
            studyAbroad: data.personal?.studyAbroad,
            education: data.personal?.education,
            website: data.contact?.website,
            instagram: data.contact?.instagram,
            xiaohongshu: data.contact?.xiaohongshu,
            wechat: data.contact?.wechat,
            contactEmail: data.contact?.email,
            phone: data.contact?.phone,
            quoteParagraphs: data.quoteParagraphs ?? undefined,
          },
        });

        if (data.galleries !== undefined) {
          await tx.artistGallery.deleteMany({ where: { profileId } });
          if (data.galleries.length > 0) {
            await tx.artistGallery.createMany({
              data: data.galleries.map((g, idx) => ({
                profileId,
                name: g.name || null,
                location: g.location || null,
                logoUrl: g.logoUrl || null,
                sortOrder: idx,
              })),
            });
          }
        }

        return tx.artistProfile.findUnique({
          where: { id: profileId },
          include: { galleries: { orderBy: { sortOrder: 'asc' } } },
        });
      });

      return this.toProfileData(result!);
    } catch (err) {
      if (err instanceof ProfileError) throw err;
      this.logger.error('档案保存事务失败', err instanceof Error ? err.stack : undefined);
      throw new ProfileError('保存失败，请稍后重试', 500);
    }
  }

  private toProfileData(profile: any): ProfileData {
    return {
      id: profile.id,
      displayName: profile.displayName,
      title: profile.title,
      nationality: profile.nationality,
      city: profile.city,
      avatarUrl: profile.avatarUrl,
      personal: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        nationality: profile.nationality,
        birthYear: profile.birthYear,
        birthPlace: profile.birthPlace,
        residence: profile.residence,
        studyAbroad: profile.studyAbroad,
        education: profile.education,
      },
      contact: {
        website: profile.website,
        instagram: profile.instagram,
        xiaohongshu: profile.xiaohongshu,
        wechat: profile.wechat,
        email: profile.contactEmail,
        phone: profile.phone,
      },
      quoteParagraphs: profile.quoteParagraphs,
      galleries: (profile.galleries || []).map((g: any) => ({
        id: g.id,
        name: g.name,
        location: g.location,
        logoUrl: g.logoUrl,
        sortOrder: g.sortOrder,
      })),
    };
  }
}

/** 档案业务错误 */
export class ProfileError extends Error {
  constructor(
    readonly message: string,
    readonly code = 400,
  ) {
    super(message);
  }
}