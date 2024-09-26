import { Body, Controller, Post, HttpStatus, Res, Get } from '@nestjs/common';
import { AccountsService } from '../../services/accounts/accounts.service';
import { LoginDto } from '../dtos/login.dto';
import { Response } from 'express';

@Controller('accounts-get')
export class AccountsControllerGet {
  constructor(private accountsService: AccountsService) {}

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
  @Get('details')
  async getAllDetails(@Res() res: Response) {
    try {
      const details = await this.accountsService.findAllDetails();

      return res.status(HttpStatus.OK).json({
        message: 'All details fetched successfully',
        details,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Error fetching details: ${error.message}`,
      });
    }
  }
}
