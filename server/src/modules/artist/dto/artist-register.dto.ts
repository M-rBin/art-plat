import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** 艺术家注册入参 */
export class ArtistRegisterDto {
  @ApiProperty({ description: '注册邮箱' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @MaxLength(200)
  email: string;

  @ApiProperty({ description: '密码（≥8 位，含字母和数字）' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(8, { message: '密码需至少 8 位，且包含字母和数字' })
  @MaxLength(128)
  @Matches(/(?=.*[a-zA-Z])(?=.*\d)/, { message: '密码需至少 8 位，且包含字母和数字' })
  password: string;
}
