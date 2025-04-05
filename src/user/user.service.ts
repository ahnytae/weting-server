import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, MailRequestDto } from './dto/create-user.dto';
import User from './entities/user.entity';
import EmailService from '../email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async findGetUser(memberId: string) {
    try {
      const findUser = await this.userRepository.findOneBy({ memberId });
      if (!findUser) {
        // await this.createUser(userDto);

        return { isJoined: false };
      }
      return {
        isJoined: true,
        user: findUser,
      };
    } catch {}
  }

  async createUser(userDto: CreateUserDto) {
    await this.userRepository.save(userDto);
  }

  async joinUser(memberId: string) {
    const user = await this.userRepository.findOneBy({
      memberId,
    });

    try {
      await this.userRepository.save({
        ...user,
        createdAt: new Date(),
        deletedAt: null,
        isValidate: false,
        mailValidateCode: null,
      });
    } catch {
      throw new NotFoundException('Not found user');
    }
  }

  async mailValidate(mailRequestDto: MailRequestDto) {
    const { memberId, email } = mailRequestDto;
    const randomCode = this.generateRandomCode();

    try {
      await this.emailService.sendMail({
        to: email,
        subject: 'weting 이메일 인증',
        html: `<h1>인증번호는 ${randomCode} 입니다.</h1>`,
      });

      // Todo: Redis 저장 필요
      await this.userRepository.update(
        { memberId },
        { email, mailValidateCode: randomCode },
      );
    } catch {
      throw new NotFoundException('Not found email');
    }
  }

  async checkMailValidate(email: string, code: string) {
    const findUser = await this.userRepository.findOneBy({ email });
    if (!findUser) {
      throw new NotFoundException('Not found user');
    }

    if (findUser.mailValidateCode !== +code) {
      throw new NotFoundException('miss match code');
    }

    await this.userRepository.update(
      { email },
      { isValidate: true, mailValidateCode: null },
    );
  }

  private generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
