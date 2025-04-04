import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '카카오 회원 고유 아이디' })
  memberId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '카톡 이름' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '카톡 닉네임' })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '카톡 이메일' })
  email: string;
}

export class CreatedUserResponse {
  @IsBoolean()
  @ApiProperty({ example: '회원 가입 되어있는지 여부' })
  isJoined: boolean;
}
