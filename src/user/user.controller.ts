import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import {
  CreateUserDto,
  CreatedResponseDto,
} from './dto/create-user.dto';
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
  @ApiResponse({
    status: 201,
    type: CreatedResponseDto,
  })
  async createUser(@Body() userDto: CreateUserDto) {
    const { memberId } = userDto;

    await this.userService.createUser(userDto);
    const accessToken = await this.authService.generateToken(
      memberId,
      TOKEN_TYPE['ACCESS'],
    );
    const refreshToken = await this.authService.generateToken(
      memberId,
      TOKEN_TYPE['REFRESH'],
    );

    return {
      accessToken,
      refreshToken,
    };
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
    return await this.userService.checkMailValidate(email, code);
  }
}
