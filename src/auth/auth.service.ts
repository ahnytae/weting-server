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

  async reissue(refreshToken: string) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new NotFoundException(ERROR_CODES.ERR_002);
    }

    const { isExpired } = await this.verifyToken(refreshToken);

    if (isExpired) {
      throw new NotFoundException(ERROR_CODES.ERR_005);
    }

    const auth = await this.authRepository.findOneBy({ refreshToken });

    if (!auth) {
      throw new NotFoundException(ERROR_CODES.ERR_001);
    }

    const { memberId } = auth.user;
    const newAccessToken = await this.generateToken(
      memberId,
      TOKEN_TYPE.ACCESS,
    );

    return {
      newAccessToken: newAccessToken.token,
    };
  }

  async autoLogin(refreshToken: string) {
    const auth = await this.authRepository.findOneBy({ refreshToken });

    if (!auth) {
      throw new NotFoundException(ERROR_CODES.ERR_001);
    }

    const { memberId } = auth.user;
    const newAccessToken = await this.generateToken(
      memberId,
      TOKEN_TYPE.ACCESS,
    );
    const newRefreshToken = await this.generateToken(
      memberId,
      TOKEN_TYPE.REFRESH,
    );

    auth.refreshToken = newRefreshToken.token;
    await this.authRepository.save(auth);

    return {
      newAccessToken: newAccessToken.token,
      newRefreshToken: newRefreshToken.token,
    };
  }

  async serviceSignin(memberId: string) {
    const findUser = await this.userService.findUserOrNull(memberId);

    if (!findUser) {
      throw new NotFoundException(ERROR_CODES.ERR_001);
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

  private async verifyToken(token: string): Promise<{
    isExpired: boolean;
  }> {
    try {
      const payload = this.jwtService.decode(token);

      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();
      const isExpired = expirationDate.getTime() <= now.getTime();

      return { isExpired };
    } catch {
      return { isExpired: false };
      // throw new UnauthorizedException(ErrorCodes.ERR_01);
    }
  }
}
