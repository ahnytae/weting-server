import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { EmailModule } from '../email/email.module';
import { UserController } from './user.controller';
import Email from '../email/entities/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Email]), EmailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
