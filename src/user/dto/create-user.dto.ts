import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GENDER } from '../types/userType';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '카카오 회원 고유 아이디' })
  memberId: string;

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
