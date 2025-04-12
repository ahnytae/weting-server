import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AutoSigninDto, SigninDto } from './dto/signin.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/auto-login')
  @ApiOperation({
    summary: '자동 로그인',
    description: 'Refresh Token 체크 후 Access Token & Refresh token 발급',
  })
  @ApiBody({
    type: AutoSigninDto,
  })
  @ApiResponse({
    status: 201,
    description: '헤더로 Access 토큰 반환.',
    headers: {
      Authorization: {
        description: 'Access Token',
        schema: {
          type: 'string',
          example:
            'Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      'Refresh-Token': {
        description: 'Refresh token',
        schema: {
          type: 'string',
          example: 'Refresh-Token = eyjeifleifk23452....',
        },
      },
    },
  })
  async autoLogin(@Body() autoSigninDto: AutoSigninDto, @Res() res: Response) {
    const { refreshToken } = autoSigninDto;

    const { newAccessToken, newRefreshToken } =
      await this.authService.autoLogin(refreshToken);

    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    res.setHeader('Refresh-Token', newRefreshToken);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Login',
    description: '카톡 로그인, 미가입된 유저일 시 회원가입 처리',
  })
  @ApiBody({
    type: SigninDto,
  })
  @ApiResponse({
    status: 201,
    description: '헤더로 Access 토큰 반환.',
    headers: {
      Authorization: {
        description: 'Access Token',
        schema: {
          type: 'string',
          example:
            'Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  async signIn(@Body() signinDto: SigninDto, @Res() res: Response) {
    const { memberId } = signinDto;
    const { accessToken } = await this.authService.serviceSignin(memberId);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
  }

  @Post('/reissue')
  @ApiOperation({
    summary: 'Access Token 재발급',
    description: 'Access Token 재발급',
  })
  @ApiBody({
    type: AutoSigninDto,
  })
  @ApiResponse({
    status: 201,
    description: '헤더로 Access 토큰 반환.',
    headers: {
      Authorization: {
        description: 'Access Token',
        schema: {
          type: 'string',
          example:
            'Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  async reissue(@Body() autoSigninDto: AutoSigninDto, @Res() res: Response) {
    const { refreshToken } = autoSigninDto;
    const { newAccessToken } = await this.authService.reissue(refreshToken);
    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
  }
}
