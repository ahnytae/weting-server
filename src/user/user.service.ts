import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';
import Email from '../email/entities/email.entity';
import EmailService from '../email/email.service';
import { MailRequestDto } from './dto/mail-validate.dto';
import { JwtPayload } from 'src/auth/type/auth.types';
import { ERROR_CODES } from '../common/errorCodes';
import { TOKEN_TYPE } from '../auth/dto/signin.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    private readonly emailService: EmailService,
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
      throw new NotFoundException(ERROR_CODES.ERR_001);
    }
  }

  async createUser(userDto: CreateUserDto) {
    const { memberId } = userDto;
    const createdUser = await this.userRepository.save({
      ...userDto,
      createdAt: new Date(),
      deletedAt: null,
    });

    // const { accessToken, refreshToken } = await this.generateJwtToken(memberId);
    // await this.authService.saveAuth(createdUser, refreshToken);
    //
    // return {
    //   accessToken,
    //   refreshToken,
    // };
  }

  async mailValidate(mailRequestDto: MailRequestDto) {
    const { memberId, email } = mailRequestDto;
    const randomCode = this.generateRandomCode();

    const findUser = await this.userRepository.findOneBy({ memberId });

    if (!findUser) {
      throw new NotFoundException(ERROR_CODES.ERR_001);
    }

    const findEmail = await this.emailRepository.findOneBy({ email });

    if (!findEmail) {
      throw new NotFoundException(ERROR_CODES.ERR_013);
    }

    try {
      await this.emailService.sendMail({
        to: email,
        subject: '[weting] 이메일 인증',
        html: `<h1>인증번호는 ${randomCode} 입니다.</h1>`,
      });

      const saveEmail = await this.emailRepository.save({
        email: email,
        createdAt: new Date(),
        // Todo: Redis 저장 필요
        randomCode: randomCode,
      });

      await this.userRepository.save({
        ...findUser,
        email: saveEmail,
      });
    } catch {
      throw new HttpException('이메일 전송에 실패했습니다.', 500);
    }
  }

  async checkMailValidate(email: string, code: string) {
    const findMail = await this.emailRepository.findOneBy({ email });

    if (!findMail) {
      throw new NotFoundException(ERROR_CODES.ERR_013);
    }

    const checkRandomCode = findMail.randomCode;

    if (!checkRandomCode) {
      throw new NotFoundException(ERROR_CODES.ERR_013);
    }

    if (checkRandomCode !== +code) {
      throw new NotFoundException(ERROR_CODES.ERR_014);
    }

    await this.emailRepository.save({
      ...findMail,
      checkRandomCode,
      isValidate: true,
    });

    const { accessToken, refreshToken } = await this.generateJwtToken(
      findMail.user.memberId,
    );
    await this.authService.saveAuth(findMail.user, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
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

  private generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
