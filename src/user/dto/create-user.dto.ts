import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GENDER } from '../types/userType';

export class MailRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '카카오 회원 고유 아이디' })
  memberId: string;

  @IsString()
  @ApiProperty({ example: '이메일' })
  email: string;
}

export class ValidateCheckDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '이메일' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '인증 코드' })
  code: string;
}

export class MemberIdDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '카카오 회원 고유 아이디' })
  memberId: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '카카오 회원 고유 아이디' })
  memberId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '카톡 이름' })
  name: string;

  @IsEnum(GENDER)
  gender: GENDER;

  @IsDate()
  @IsNotEmpty()
  birth: Date;

  // Todo: Image..
}

export class JoinUserDto {
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

  @IsEnum(GENDER)
  gender: GENDER;

  @IsDate()
  @IsNotEmpty()
  birth: Date;

  // @IsString()
  // @ApiProperty({ example: '대표 프로필 이미지' })
  // mainProfileImage: string;
  //
  // @IsString()
  // @ApiProperty({ example: '서브 프로필 이미지' })
  // subProfileImage: string;

  // @IsString()
  // @ApiProperty({ example: '명함 이미지' })
  // businessCard: string;
}

export class CreatedUserResponse {
  @IsBoolean()
  @ApiProperty({ example: '회원 가입 되어있는지 여부' })
  isJoined: boolean;

  @ApiProperty({ example: '가입된 유저 정보' })
  findUser: CreateUserDto;
}
