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
}

export class SigninResponseDto {
  @ApiProperty({
    description: 'access token or refresh token',
    example: '075b9be6-6d99-4e08-942d-4e392fef80a7',
  })
  accessToken: string;
}
