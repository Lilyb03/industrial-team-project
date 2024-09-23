import { Controller, Get, Res, Param } from '@nestjs/common';
import { join } from 'path';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return "Hello from root";
  }
}
