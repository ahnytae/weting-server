import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import JwtGuard from './auth/guard/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  @UseGuards(JwtGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
