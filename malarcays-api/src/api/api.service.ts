import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class ApiService {
	ping(req: Request, res: Response): object {
		return {
			"type": 0,
			"message": "pong"
		};
	}
}