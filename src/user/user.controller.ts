import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import {
  CreatedUserResponse,
  CreateUserDto,
  MailRequestDto,
  ValidateCheckDto,
  MemberIdDto,
} from './dto/create-user.dto';

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
  async loginUser(@Body() memberIdDto: MemberIdDto) {
    return await this.userService.findGetUser(memberIdDto.memberId);
  }

  @Post('/create')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입 - 회원정보 입력',
  })
  @ApiResponse({
    status: 201,
  })
  async createUser(@Body() userDto: CreateUserDto) {
    return await this.userService.createUser(userDto);
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
    status: 200,
  })
  async checkMailValidate(@Body() dto: ValidateCheckDto) {
    const { email, code } = dto;
    return await this.userService.checkMailValidate(email, code);
  }
}
