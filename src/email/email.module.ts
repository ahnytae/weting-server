import { Module } from '@nestjs/common';
import EmailService from './email.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../user/entities/user.entity';
import Email from './entities/email.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Email])],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
