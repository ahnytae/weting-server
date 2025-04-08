import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MailRequestDto {
  @IsString()
  @ApiProperty({ description: '카카오 회원 고유 아이디' })
  memberId: string;

  @IsEmail()
  @ApiProperty({ example: 'abc@naver.com' })
  email: string;
}

export class MailValidateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'abc@gmail.com' })
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '123456' })
  code: string;
}
