import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import Email from '../email/entities/email.entity';
import { JwtPayload } from 'src/auth/type/auth.types';
import { ERROR_CODES } from '../common/errorCodes';
import { TOKEN_TYPE } from '../auth/dto/signin.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { PartialEmailType } from './types/userType';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async validateJwtToken(payload: JwtPayload): Promise<User> {
    const { memberId } = payload;
    const user = this.userRepository.findOneBy({ memberId });

    if (!user) {
      throw new UnauthorizedException(ERROR_CODES.ERR_004);
    }

    return user;
  }

  async findUserOrNull(memberId: string) {
    try {
      const findUser = await this.userRepository.findOneBy({ memberId });

      if (!findUser) {
        return null;
      }

      return findUser;
    } catch {
      throw new UnauthorizedException(ERROR_CODES.ERR_001);
    }
  }

  async createUser(userDto: CreateUserDto) {
    const { kakaoAccessToken, ...filterdUserDto } = userDto;

    const createdUser = await this.userRepository.save({
      ...filterdUserDto,
      createdAt: new Date(),
      deletedAt: null,
    });

    return createdUser;
  }

  async updateUser(user: User, email: any) {
    try {
      await this.userRepository.save({
        ...user,
        email,
      });
    } catch {
      throw new HttpException('유저 정보 업데이트에 실패했습니다.', 400);
    }
  }

  private async generateJwtToken(memberId: string) {
    const accessToken = await this.authService.generateToken(
      memberId,
      TOKEN_TYPE['ACCESS'],
    );
    const refreshToken = await this.authService.generateToken(
      memberId,
      TOKEN_TYPE['REFRESH'],
    );

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };
  }
}
