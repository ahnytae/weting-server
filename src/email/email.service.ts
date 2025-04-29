import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { Repository } from 'typeorm';
import Email from './entities/email.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_CODES } from '../common/errorCodes';

@Injectable()
export default class EmailService {
  private nodemailerTransport: any;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
  ) {
    this.nodemailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }

  async saveEmail(email: Partial<Email>) {
    try {
      return await this.emailRepository.save({
        ...email,
        createdAt: new Date(),
        deletedAt: null,
      });
    } catch {
      throw new HttpException('이메일 전송에 실패했습니다.', 500);
    }
  }

  async findEmail(email: string) {
    try {
      const emailData = await this.emailRepository.findOne({
        where: { email },
        relations: ['user'],
      });
      if (!emailData) {
        throw new NotFoundException(ERROR_CODES.ERR_013);
      }
      return emailData;
    } catch (e) {}
  }
}
