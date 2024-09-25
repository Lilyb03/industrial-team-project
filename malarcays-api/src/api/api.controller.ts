import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { ApiService } from './api.service';

@Controller()
export class ApiController {
	constructor(private readonly apiService: ApiService) { }

	@Get()
	ping(@Req() req: Request, @Res({ passthrough: true }) res: Response): string {
		res.setHeader("Content-Type", "application/json");
		return JSON.stringify(this.apiService.ping(req, res));
	}

	@Get('test')
	async dbTest(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
		res.setHeader("Content-Type", "application/json");
		return JSON.stringify(await this.apiService.dbTest(req, res));
	}

	@Get('balance')
	async getBalance(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
		res.setHeader("Content-Type", "application/json");
		return JSON.stringify(await this.apiService.getBalance(req, res));
	}

	@Get('account')
	async accountSearch(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
		res.setHeader("Content-Type", "application/json");
		return JSON.stringify(await this.apiService.accountSearch(req, res));
	}

	@Get('company')
	async companySearch(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
		res.setHeader("Content-Type", "application/json");
		return JSON.stringify(await this.apiService.companySearch(req, res));
	}

	@Post('transaction')
	async createTransaction(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
		res.setHeader("Content-Type", "application/json");
		return JSON.stringify(await this.apiService.createTransaction(req, res));
	}
}