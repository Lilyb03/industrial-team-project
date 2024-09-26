import { Body, Controller, Post, HttpStatus, Res } from '@nestjs/common';
import { CreateAccountsDTO } from '../dtos/createAccounts.dto';
import { AccountsService } from '../../services/accounts/accounts.service';
import { Response } from 'express';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post('create')
  async createAccounts(@Body() createAccountsDto: CreateAccountsDTO, @Res() res: Response) {
    try {
      const account = await this.accountsService.createAccount(createAccountsDto);
      return res.status(HttpStatus.CREATED).json({ message: 'Account created', data: account });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error creating account: ${error.message}` });
    }
  }
}
