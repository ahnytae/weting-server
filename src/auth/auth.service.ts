import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { TOKEN_TYPE } from './dto/signin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Auth from './entities/auth.entity';
import { Repository } from 'typeorm';
import { ERROR_CODES } from '../common/errorCodes';
import { CreateUserDto } from '../user/dto/create-user.dto';
import User from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async serviceSignin(memberId: string, refreshToken: string) {
    const findUser = await this.userService.findUserOrNull(memberId);
    const userAuth = await this.authRepository.findOneBy({
      user: { memberId },
    });

    if (!findUser) {
      throw new NotFoundException(ERROR_CODES.ERR_001);
    }

    if (refreshToken !== userAuth.refreshToken) {
      throw new NotFoundException(ERROR_CODES.ERR_002);
    }

    const accessToken = await this.generateToken(memberId, TOKEN_TYPE.ACCESS);
    return {
      accessToken: accessToken.token,
    };
  }

  async generateToken(memberId: string, tokenType: TOKEN_TYPE) {
    const findUser = await this.userService.findUserOrNull(memberId);
    const { nickname, email } = findUser;

    const secretKey = this.configService.get(
      tokenType === 'ACCESS' ? 'JWT_ACCESS_SECRET' : 'JWT_REFRESH_SECRET',
    );

    const expirationTime = this.configService.get(
      tokenType === 'ACCESS'
        ? 'JWT_ACCESS_EXPIRATION_TIME'
        : 'JWT_REFRESH_EXPIRATION_TIME',
    );
    const payload = { memberId, nickname, email };

    const token = await this.jwtService.signAsync(payload, {
      secret: secretKey,
      expiresIn: `${expirationTime}`,
    });

    return { token };
  }

  async saveAuth(user: User, refreshToken: string) {
    const auth = this.authRepository.create({
      user,
      refreshToken,
    });

    await this.authRepository.save(auth);
  }
}
