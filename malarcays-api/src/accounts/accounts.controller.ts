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
    /**
     * Route handler for /signup route, used to create an account
     * @param {CreateAccountsDTO} body - request body in the form of the CreateAccounts DTO
     * @return {<Response>} Promise to an express response object
     */
    try {
      //call the createAccount function and return a response if the account was creaated
      //or the creation failed
      const account = await this.accountsService.createAccount(createAccountsDto);
      return res.status(HttpStatus.CREATED).json({ message: 'Account created', data: account });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error creating account: ${error.message}` });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    /**
     * Route handler for /login route, used to log in into an account
     * @param {LoginDto} body - request body in the form of the Login Dto
     * @return {<Response>} Promise to an express response object
     */
    try {
      //call the login function and return a response if the account was successful
      //if the account was not found or some other error
      const account = await this.accountsService.login(loginDto);

      if (account === null) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Account number or password are incorrect',
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
