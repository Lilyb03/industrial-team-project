import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { sql, Account } from './utils/db';

@Injectable()
export class AppService {
	ping(req: Request, res: Response): object {
		/** 
		* Basic api test
		* @param {Request} req - express request object
		* @param {Response} res - express response object
		* @return {object} return success!!
		*/
		return {
			"type": 0,
			"message": "pong"
		};
	}

	async dbTest(req: Request, res: Response): Promise<object> {
		/** 
		* Database test function
		* @param {Request} req - express request object
		* @param {Response} res - express response object
		* @return {Promise<object>} promise to response object  
		*/

		// start timing
		const startTime = Date.now();

		// get data from db
		let data: Account[] = await sql<Account[]>`SELECT * FROM account;`;

		// end timing
		const endTime = Date.now();

		// check data is returned
		if (data.length > 0) {
			// return success object with time & number of accounts returned
			return {
				"type": 0,
				"message": "Database is up",
				"accounts": data.length,
				"took": endTime - startTime
			}
		} else {
			// no data was returned, return failure
			return {
				"type": 1,
				"message": "Database is down",
			}
		}
	}
}