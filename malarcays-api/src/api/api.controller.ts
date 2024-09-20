import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
	constructor(private readonly apiService: ApiService) { }

	@Get()
	ping(@Req() req: Request, @Res({ passthrough: true }) res: Response): string {
		return JSON.stringify(this.apiService.ping(req, res));
	}
}