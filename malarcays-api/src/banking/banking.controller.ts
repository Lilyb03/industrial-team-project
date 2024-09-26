import { Body, Controller, Post, HttpStatus, Res, Req, Get } from '@nestjs/common';
import { Request, Response } from 'express';

import { BankingService } from './banking.service';

@Controller()
export class BankingController {
  constructor(private bankingService: BankingService) { }

  @Get('balance')
  async getBalance(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
    res.setHeader("Content-Type", "application/json");
    return JSON.stringify(await this.bankingService.getBalance(req, res));
  }


  @Post('transaction')
  async createTransaction(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
    res.setHeader("Content-Type", "application/json");
    return JSON.stringify(await this.bankingService.createTransaction(req, res));
  }
}
