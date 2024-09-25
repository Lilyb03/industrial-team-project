import { Controller, Get, Res, Param, Post, Body } from '@nestjs/common';
import { join } from 'path';

import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return "Hello from root";
  }

  @Post(`test`)
  async signUp(@Body() body: string, @Res() res: Response): Promise<any> {
    console.log(body);
  }
}
