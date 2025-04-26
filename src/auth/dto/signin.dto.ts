import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export enum TOKEN_TYPE {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

export class AutoSigninDto {
  @ApiProperty({
    description: 'refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class SigninDto {
  @ApiProperty({
    description: 'kakao member id',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    description: 'kakao access token',
  })
  @IsString()
  @IsNotEmpty()
  kakaoAccessToken: string;
}
