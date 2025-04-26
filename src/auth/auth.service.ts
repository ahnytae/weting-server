import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { TOKEN_TYPE } from './dto/signin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Auth from './entities/auth.entity';
import { Repository } from 'typeorm';
import { ERROR_CODES } from '../common/errorCodes';
import User from 'src/user/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { MailRequestDto } from '../user/dto/mail-validate.dto';
import EmailService from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async reissue(refreshToken: string) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException(ERROR_CODES.ERR_002);
    }

    const { isExpired } = await this.verifyToken(refreshToken);

    if (isExpired) {
      throw new UnauthorizedException(ERROR_CODES.ERR_005);
    }

    const auth = await this.authRepository.findOneBy({ refreshToken });

    if (!auth) {
      throw new UnauthorizedException(ERROR_CODES.ERR_001);
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

    return {
      newAccessToken: newAccessToken.token,
      newRefreshToken: newRefreshToken.token,
    };
  }

  async login(memberId: string, kakaoAccessToken: string) {
    const kakaoMemberId = await this.verifyKaKaoId(kakaoAccessToken);

    if (+memberId !== kakaoMemberId) {
      throw new UnauthorizedException(ERROR_CODES.ERR_001);
    }

    const findUser = await this.userService.findUserOrNull(memberId);

    if (!findUser) {
      throw new UnauthorizedException(ERROR_CODES.ERR_001);
    }

    const accessToken = await this.generateToken(memberId, TOKEN_TYPE.ACCESS);
    const refreshToken = await this.generateToken(memberId, TOKEN_TYPE.REFRESH);
    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };
  }

  async signup(userDto: CreateUserDto) {
    const { memberId, kakaoAccessToken } = userDto;

    const kakaoId = await this.verifyKaKaoId(kakaoAccessToken);
    if (!kakaoId) {
      throw new UnauthorizedException(ERROR_CODES.ERR_001);
    }

    const findUser = await this.userService.findUserOrNull(userDto.memberId);

    if (findUser) {
      throw new UnauthorizedException(ERROR_CODES.ERR_006);
    }

    const user = await this.userService.createUser(userDto);
    const accessToken = await this.generateToken(memberId, TOKEN_TYPE.ACCESS);
    const refreshToken = await this.generateToken(memberId, TOKEN_TYPE.REFRESH);
    await this.saveAuth(user, refreshToken.token);

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };
  }

  async mailValidate(mailRequestDto: MailRequestDto) {
    const { memberId, email } = mailRequestDto;
    const randomCode = this.generateRandomCode();

    const findUser = await this.userService.findUserOrNull(memberId);

    try {
      await this.emailService.sendMail({
        to: email,
        subject: '[weting] 이메일 인증',
        html: `<h1>인증번호는 ${randomCode} 입니다.</h1>`,
      });

      const saveEmail = await this.emailService.updateVerifyCode({
        email: email,
        createdAt: new Date(),
        // Todo: Cache 저장 필요
        randomCode,
      });

      await this.userService.updateUser(findUser, saveEmail);
    } catch {}
  }

  async checkMailValidate(email: string, code: string) {
    const findMail = await this.emailService.findEmail(email);
    const { memberId } = findMail.user;

    const randomCode = findMail.randomCode;

    if (randomCode !== +code) {
      throw new NotFoundException(ERROR_CODES.ERR_014);
    }

    await this.emailService.saveEmail({
      ...findMail,
      randomCode,
      isValidate: true,
    });

    const newAccessToken = await this.generateToken(
      memberId,
      TOKEN_TYPE.ACCESS,
    );
    const newRefreshToken = await this.generateToken(
      memberId,
      TOKEN_TYPE.REFRESH,
    );

    await this.authRepository.update(
      { user: findMail.user },
      { refreshToken: newRefreshToken.token },
    );

    return {
      accessToken: newAccessToken.token,
      refreshToken: newRefreshToken.token,
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

  private generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private async verifyKaKaoId(kakaoAccessToken: string) {
    try {
      const req = await fetch(
        'https://kapi.kakao.com/v1/user/access_token_info',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`,
          },
        },
      );
      const response = await req.json();
      return response.id;
    } catch {
      throw new UnauthorizedException(ERROR_CODES.ERR_001);
    }
  }
}
