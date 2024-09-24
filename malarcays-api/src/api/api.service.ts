import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { sql, Account } from './db';

@Injectable()
export class ApiService {
	ping(req: Request, res: Response): object {
		return {
			"type": 0,
			"message": "pong"
		};
	}

	async dbTest(req: Request, res: Response): Promise<object> {
		const startTime = Date.now();
		let data: Account[] = await sql<Account[]>`select * from account`;
		const endTime = Date.now();
		if (data.length > 0) {
			return {
				"type": 0,
				"message": "Database is up",
				"accounts": data.length,
				"took": endTime - startTime
			}
		} else {
			return {
				"type": 1,
				"message": "Database is down",
			}
		}
	}
}