import { Body, Controller, Post, HttpStatus, Res, Req, Get } from '@nestjs/common';
import { Request, Response } from 'express';

import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) { }

  @Get('account')
  async accountSearch(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
    res.setHeader("Content-Type", "application/json");
    return JSON.stringify(await this.searchService.accountSearch(req, res));
  }

  @Get('company')
  async companySearch(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
    res.setHeader("Content-Type", "application/json");
    return JSON.stringify(await this.searchService.companySearch(req, res));
  }
}
