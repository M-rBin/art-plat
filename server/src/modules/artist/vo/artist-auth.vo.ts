import { ApiProperty } from '@nestjs/swagger';

/**
 * 艺术家用户信息（对外响应，不含密码）
 */
export class ArtistUserVo {
  @ApiProperty({ description: '用户 ID' })
  id: number;

  @ApiProperty({ description: '显示名称' })
  name: string;

  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty({ description: '头像 URL' })
  avatar: string;

  @ApiProperty({ description: '角色标识' })
  role: string;
}

/**
 * 登录成功响应
 */
export class ArtistLoginResultVo {
  @ApiProperty({ description: '访问 token' })
  token: string;

  @ApiProperty({ description: '当前用户信息', type: ArtistUserVo })
  user: ArtistUserVo;
}

/**
 * 注册成功响应
 */
export class ArtistRegisterResultVo {
  @ApiProperty({ description: '邮箱确认链接（开发环境直接返回，生产环境仅邮件发送）' })
  verifyUrl: string;
}
