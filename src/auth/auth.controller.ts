import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AutoSigninDto, SigninDto } from './dto/signin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { MailRequestDto, MailValidateDto } from '../user/dto/mail-validate.dto';

const TOKEN_RESPONSE = {
  status: 201,
  description: 'Access 및 Refresh 토큰을 헤더로 반환',
  headers: {
    Authorization: {
      description: 'Access Token',
      schema: {
        type: 'string',
        example: 'Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
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
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: '로그인',
    description: '카톡 로그인 후 Access/Refresh Token 발급',
  })
  @ApiBody({ type: SigninDto })
  @ApiResponse(TOKEN_RESPONSE)
  async signIn(@Body() signinDto: SigninDto, @Res() res: Response) {
    const { memberId, kakaoAccessToken } = signinDto;
    const { accessToken, refreshToken } = await this.authService.login(
      memberId,
      kakaoAccessToken,
    );
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.setHeader('Refresh-Token', refreshToken);
    return res.send();
  }

  @Post('/signup')
  @ApiOperation({
    summary: '회원가입',
    description: '회원정보 입력 후 회원가입 처리',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse(TOKEN_RESPONSE)
  async createUser(@Body() userDto: CreateUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.signup(userDto);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.setHeader('Refresh-Token', refreshToken);
    return res.send();
  }

  @Post('/reissue')
  @ApiOperation({
    summary: 'Access Token 재발급',
    description: 'Refresh Token으로 Access Token 재발급',
  })
  @ApiBody({ type: AutoSigninDto })
  @ApiResponse(TOKEN_RESPONSE)
  async reissue(@Body() autoSigninDto: AutoSigninDto, @Res() res: Response) {
    const { refreshToken } = autoSigninDto;
    const { newAccessToken } = await this.authService.reissue(refreshToken);
    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    res.setHeader('Refresh-Token', refreshToken);
    return res.send();
  }

  @Post('/validate')
  @ApiOperation({
    summary: '이메일 인증',
    description: '이메일 인증을 위한 랜덤 코드 발송',
  })
  @ApiResponse({
    status: 201,
  })
  async mailValidate(@Body() mailRequestDto: MailRequestDto) {
    return await this.authService.mailValidate(mailRequestDto);
  }

  @Post('/validate/check')
  @ApiOperation({
    summary: '이메일 인증 코드 확인',
  })
  @ApiResponse({
    status: 201,
  })
  async checkMailValidate(@Body() dto: MailValidateDto, @Res() res: Response) {
    const { email, code } = dto;

    const { accessToken, refreshToken } =
      await this.authService.checkMailValidate(email, code);

    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.setHeader('Refresh-Token', refreshToken);
    return res.send();
  }
}
