import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import { CreatedUserResponse, CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: 'Login',
    description: '카톡 로그인, 미가입된 유저일 시 회원가입 처리',
  })
  @ApiResponse({
    status: 201,
    description: ' 성공적으로 로그인 되었습니다.',
    type: CreatedUserResponse,
  })
  async loginUser(@Body() userDto: CreateUserDto) {
    return await this.authService.findGetUser(userDto);
  }
}
