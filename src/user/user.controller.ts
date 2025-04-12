import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { TOKEN_TYPE } from 'src/auth/dto/signin.dto';
import { MailRequestDto, MailValidateDto } from './dto/mail-validate.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/create')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입 - 회원정보 입력',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiOperation({ summary: '로그인 후 토큰 반환 (Header에)' })
  @ApiResponse({
    status: 201,
    description: '헤더로 Access, Refresh 토큰 반환.',
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
  async createUser(@Body() userDto: CreateUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.userService.createUser(userDto);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.setHeader('Refresh-Token', refreshToken);
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
    return await this.userService.mailValidate(mailRequestDto);
  }

  @Post('/validate/check')
  @ApiOperation({
    summary: '이메일 인증 코드 확인',
  })
  @ApiResponse({
    status: 201,
  })
  async checkMailValidate(@Body() dto: MailValidateDto) {
    const { email, code } = dto;
    await this.userService.checkMailValidate(email, code);
  }
}
