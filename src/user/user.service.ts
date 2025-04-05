import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, MailRequestDto } from './dto/create-user.dto';
import User from './entities/user.entity';
import Email from '../email/entities/email.entity';
import EmailService from '../email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    private readonly emailService: EmailService,
  ) {}

  async findGetUser(memberId: string) {
    try {
      const findUser = await this.userRepository.findOneBy({ memberId });
      if (!findUser) {
        return { isJoined: false };
      }
      return {
        isJoined: true,
        user: findUser,
      };
    } catch {}
  }

  async createUser(userDto: CreateUserDto) {
    await this.userRepository.save({
      ...userDto,
      createdAt: new Date(),
      deletedAt: null,
    });
  }

  async mailValidate(mailRequestDto: MailRequestDto) {
    const { memberId, email } = mailRequestDto;
    const randomCode = this.generateRandomCode();

    const findUser = await this.userRepository.findOneBy({ memberId });

    if (!findUser || findUser.email !== email) {
      throw new NotFoundException('Not found user');
    }

    try {
      await this.emailService.sendMail({
        to: email,
        subject: '[weting] 이메일 인증',
        html: `<h1>인증번호는 ${randomCode} 입니다.</h1>`,
      });

      await this.emailRepository.save({
        email: email,
        isValidate: false,
        createdAt: new Date(),

        // Todo: Redis 저장 필요
        randomCode: randomCode,
      });

      await this.userRepository.save({
        ...findUser,
        email,
      });
    } catch {
      throw new NotFoundException('Not found email');
    }
  }

  async checkMailValidate(email: string, code: string) {
    const findUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!findUser) {
      throw new NotFoundException('Not found user');
    }

    const checkRandomCode = await this.emailRepository.findOne({
      where: { email },
    });
    if (!checkRandomCode) {
      throw new NotFoundException('Not found email');
    }

    if (checkRandomCode.randomCode !== +code) {
      throw new NotFoundException('miss match code');
    }

    await this.emailRepository.save({
      ...checkRandomCode,
      isValidate: true,
    });
  }

  private generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
