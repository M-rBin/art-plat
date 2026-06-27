import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminAccountVo {
  @ApiProperty({ description: '账号 ID' })
  id: number;

  @ApiProperty({ description: '登录邮箱' })
  email: string;

  @ApiPropertyOptional({ description: '显示名称' })
  name: string | null;

  @ApiPropertyOptional({ description: '头像 URL（来自档案）' })
  avatarUrl: string | null;

  @ApiPropertyOptional({ description: '国籍（来自档案）' })
  nationality: string | null;

  @ApiProperty({ description: '角色/艺术家类型（role 字段）' })
  role: string;

  @ApiProperty({ description: '邮箱是否已确认' })
  emailVerified: boolean;

  @ApiProperty({ description: '状态 1=启用 0=禁用' })
  status: number;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;
}

export class ResetPasswordVo {
  @ApiProperty({ description: '账号 ID' })
  id: number;

  @ApiProperty({ description: '临时密码（明文，仅此一次）' })
  tempPassword: string;
}
