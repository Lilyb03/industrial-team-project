import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  ping(@Req() req: Request, @Res({ passthrough: true }) res: Response): string {
    res.setHeader("Content-Type", "application/json");
    return JSON.stringify(this.appService.ping(req, res));
  }

  @Get('test')
  async dbTest(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
    res.setHeader("Content-Type", "application/json");
    return JSON.stringify(await this.appService.dbTest(req, res));
  }

}