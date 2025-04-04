import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import { CreatedUserResponse, CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    return await this.userService.findGetUser(userDto);
  }
}
