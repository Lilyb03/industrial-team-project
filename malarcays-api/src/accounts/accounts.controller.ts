import { Body, Controller, Post, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

import { CreateAccountsDTO } from './dtos/createAccounts.dto';
import { LoginDto } from './dtos/login.dto';
import { AccountsService } from './accounts.service';

@Controller()
export class AccountsController {
  constructor(private accountsService: AccountsService) { }

  @Post('signup')
  async createAccounts(@Body() createAccountsDto: CreateAccountsDTO, @Res() res: Response) {
    try {
      const account = await this.accountsService.createAccount(createAccountsDto);
      return res.status(HttpStatus.CREATED).json({ message: 'Account created', data: account });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error creating account: ${error.message}` });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const account = await this.accountsService.login(loginDto.name);

      if (account === null) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Account not found',
        });
      }

      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        account,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Error during login: ${error.message}`,
      });
    }
  }
}
