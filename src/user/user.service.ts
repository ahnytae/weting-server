import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';
import EmailService from '../email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async findGetUser(userDto: CreateUserDto) {
    const { memberId } = userDto;

    // Todo: email validate
    // await this.emailService.sendMail({
    //   to: '',
    //   subject: '',
    //   html: `<h1></h1>`,
    // });

    try {
      const findUser = await this.authRepository.findOneBy({ memberId });
      if (!findUser) {
        await this.createUser(userDto);

        return { isJoined: false, ...findUser };
      }
      return {
        isJoined: true,
      };
    } catch {}
  }

  private async createUser(userDto: CreateUserDto) {
    try {
      await this.authRepository.save({
        ...userDto,
        createdAt: new Date(),
        deletedAt: null,
      });
    } catch {
      throw new NotFoundException('Not found user');
    }
  }
}
