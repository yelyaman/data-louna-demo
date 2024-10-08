import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('endpoint1')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('endpoint2')
  getHello(): string {
    return this.appService.getHello();
  }
}
