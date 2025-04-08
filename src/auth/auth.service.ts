import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { TOKEN_TYPE } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async serviceSignin(memberId: string, refreshToken: string) {
    
  }

  async generateToken(memberId: string, tokenType: TOKEN_TYPE) {
    const findUser = await this.userService.findGetUser(memberId);
    const { nickname, email } = findUser.user;

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
}
