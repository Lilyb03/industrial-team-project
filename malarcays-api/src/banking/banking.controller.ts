import { Body, Controller, Post, HttpStatus, Res, Req, Get, Query, Param } from '@nestjs/common';
import { Request, Response } from 'express';

import { BankingService } from './banking.service';
import { TransactionDTO } from './dtos/transaction.dto';
import { BalanceDTO } from './dtos/balance.dto';

@Controller()
export class BankingController {
  constructor(private bankingService: BankingService) { }

  @Get('balance')
  async getBalance(@Query() body: BalanceDTO, @Res() res: Response): Promise<Response> {
    /** 
    * Route handler for /balance route, used to get private data on an account
    * @param {BalanceDTO} body - request body in the form of the balance DTO
    * @return {Promise<Response>} Promise to an express response object
    */

    try {
      // get provider result
      const result = await this.bankingService.getBalance(body, res);

      // if client input is incorrect, return to client
      if (result["type"] === 1) {
        return res.status(HttpStatus.BAD_REQUEST).json(result)
      }

      // return result to client
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      // if error occurs, return this to client
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        "type": 1,
        "message": `Could not fetch balance: ${error.message}`
      });
    }
  }


  @Post('transaction')
  async createTransaction(@Body() body: TransactionDTO, @Res() res: Response): Promise<Response> {
    /** 
    * Route handler for the /transaction route, used to initiate a transaction
    * @param {TrasnactionDTO} body - the request body in the form of a transaction DTO
    * @param {Response} res - the express response object
    * @return {Promise<Response>} promise to express response object
    */

    try {
      // get provider result
      const result = await this.bankingService.createTransaction(body, res);

      // if client input is incorrect, return to client
      if (result["type"] === 1) {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }

      // return result to client
      return res.status(HttpStatus.OK).json(result)

    } catch (error) {
      // if error occurs, return this to client
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        "type": 1,
        "message": `Could not create transaction: ${error.message}`
      })
    }
  }
}
