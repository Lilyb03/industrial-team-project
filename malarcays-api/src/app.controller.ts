import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/test')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  getRoot(@Res({ passthrough: true }) res: Response): string {
    res.status(200);
    return "Hello from root";
  }
}
