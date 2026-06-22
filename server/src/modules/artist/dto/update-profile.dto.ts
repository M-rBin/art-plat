import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional, IsString, MaxLength, IsArray,
  ValidateNested, ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PersonalDto {
  @ApiPropertyOptional({ description: '名' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string | null;

  @ApiPropertyOptional({ description: '姓' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string | null;

  @ApiPropertyOptional({ description: '国籍' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nationality?: string | null;

  @ApiPropertyOptional({ description: '出生年月' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  birthYear?: string | null;

  @ApiPropertyOptional({ description: '出生地' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  birthPlace?: string | null;

  @ApiPropertyOptional({ description: '现居地' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  residence?: string | null;

  @ApiPropertyOptional({ description: '留学经历' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  studyAbroad?: string | null;

  @ApiPropertyOptional({ description: '学历' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  education?: string | null;
}

export class ContactDto {
  @ApiPropertyOptional({ description: '网站' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  website?: string | null;

  @ApiPropertyOptional({ description: 'Instagram' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  instagram?: string | null;

  @ApiPropertyOptional({ description: '小红书' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  xiaohongshu?: string | null;

  @ApiPropertyOptional({ description: '微信' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  wechat?: string | null;

  @ApiPropertyOptional({ description: '联系邮箱' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  email?: string | null;

  @ApiPropertyOptional({ description: '电话' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string | null;
}

export class GalleryItemDto {
  @ApiPropertyOptional({ description: '画廊名称' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string | null;

  @ApiPropertyOptional({ description: '城市国家' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string | null;

  @ApiPropertyOptional({ description: '标识图片 URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string | null;
}

/** 更新档案请求 DTO */
export class UpdateProfileDto {
  @ApiPropertyOptional({ description: '艺术家姓名' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  displayName?: string | null;

  @ApiPropertyOptional({ description: '职位' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string | null;

  @ApiPropertyOptional({ description: '国籍' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nationality?: string | null;

  @ApiPropertyOptional({ description: '所在城市' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string | null;

  @ApiPropertyOptional({ description: '头像 URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string | null;

  @ApiPropertyOptional({ description: '个人信息', type: PersonalDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PersonalDto)
  personal?: PersonalDto;

  @ApiPropertyOptional({ description: '联系方式', type: ContactDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactDto)
  contact?: ContactDto;

  @ApiPropertyOptional({ description: '中国引言 [{fr, zh}]' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  quoteParagraphs?: Array<{ fr?: string; zh?: string }>;

  @ApiPropertyOptional({ description: '代理画廊列表', type: [GalleryItemDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => GalleryItemDto)
  galleries?: GalleryItemDto[];
}
