import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryQuestionDto {
  @ApiPropertyOptional({ description: '关键词（模糊匹配法文/中文内容）' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '状态 1=启用 0=禁用' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1])
  status?: number;

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页条数', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;
}

export class CreateQuestionDto {
  @ApiProperty({ description: '问题（法文）' })
  @IsString()
  @MaxLength(500)
  contentFr: string;

  @ApiProperty({ description: '问题（中文）' })
  @IsString()
  @MaxLength(500)
  contentZh: string;

  @ApiPropertyOptional({ description: '排序号（升序），默认 0' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number = 0;

  @ApiPropertyOptional({ description: '状态 1=启用 0=禁用，默认 1' })
  @IsOptional()
  @IsInt()
  @IsIn([0, 1])
  status?: number = 1;
}

export class UpdateQuestionDto {
  @ApiPropertyOptional({ description: '问题（法文）' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  contentFr?: string;

  @ApiPropertyOptional({ description: '问题（中文）' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  contentZh?: string;

  @ApiPropertyOptional({ description: '排序号' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ description: '状态 1=启用 0=禁用' })
  @IsOptional()
  @IsInt()
  @IsIn([0, 1])
  status?: number;
}

export class UpdateQuestionStatusDto {
  @ApiProperty({ description: '状态 1=启用 0=禁用' })
  @IsInt()
  @IsIn([0, 1])
  status: number;
}
