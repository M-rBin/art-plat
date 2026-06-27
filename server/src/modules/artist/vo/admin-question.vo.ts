import { ApiProperty } from '@nestjs/swagger';

export class AdminQuestionVo {
  @ApiProperty({ description: '问题 ID' })
  id: number;

  @ApiProperty({ description: '问题（法文）' })
  contentFr: string;

  @ApiProperty({ description: '问题（中文）' })
  contentZh: string;

  @ApiProperty({ description: '排序号' })
  sortOrder: number;

  @ApiProperty({ description: '状态 1=启用 0=禁用' })
  status: number;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  updateTime: Date;
}
