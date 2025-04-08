import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SigninDto, SigninResponseDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    type: SigninResponseDto,
  })
  async signIn(@Body() signinDto: SigninDto) {
    const { memberId, refreshToken } = signinDto;
    return await this.authService.serviceSignin(memberId, refreshToken);
  }
}
