import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GENDER } from '../../user/types/userType';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '카카오 회원 고유 아이디' })
  memberId: string;

  @ApiProperty({
    description: '카카오 액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  kakaoAccessToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '프로필명' })
  nickname: string;

  @IsEnum(GENDER)
  @IsNotEmpty()
  @ApiProperty({ example: 'MALE | FEMALE' })
  gender: GENDER;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ example: '생년월일 Date 형식' })
  birth: Date;

  // Todo: Image..
}
