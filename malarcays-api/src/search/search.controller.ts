import { Body, Controller, Post, HttpStatus, Res, Req, Get, Query } from '@nestjs/common';
import { Request, Response } from 'express';

import { SearchService } from './search.service';
import { AccountDTO } from './dtos/account.dto';
import { CompanyDTO } from './dtos/company.dto';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) { }

  @Get('account')
  async accountSearch(@Query() body: AccountDTO, @Res() res: Response): Promise<Response> {
    /** 
    * Account search route handler for /search/account route
    * @param {AccountDTO} body - request body in the form of account search data
    * @param {Response} res - express response object
    * @return {Promise<Response>} promise to express response object
    */

    try {
      // get result from provider
      const result = await this.searchService.accountSearch(body, res);

      // if client input was invalid, return error to client
      if (result["type"] === 1) {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }

      // return result to client
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      // if error occurs, return to client
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        "type": 1,
        "message": `Could not fetch accounts: ${error.message}`
      });
    }
  }

  @Get('company')
  async companySearch(@Query() body: CompanyDTO, @Res() res: Response): Promise<Response> {
    /** 
    * Company search route handler for /search/company route
    * @param {CompanyDTO} body - request body in the form of company search data
    * @param {Response} res - express response object
    * @return {Promise<Response>} Promise to express response object
    */

    try {
      // get result from provider
      const result = await this.searchService.companySearch(body, res);

      // if client input was invalid, return error to client
      if (result["type"] === 1) {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }

      // return result to client
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      // if error occurs, return to client
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        "type": 1,
        "message": `Could not fetch companies: ${error.message}`
      });
    }
  }
}
