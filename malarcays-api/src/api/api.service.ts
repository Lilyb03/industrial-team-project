import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { sql, Account, Type, Transaction } from './db';
import { AccountData } from './api';

@Injectable()
export class ApiService {
	checkHeaders(req: Request): object {
		if (req.method == "POST" && req.headers["content-type"] != "application/json") {
			return {
				"type": 1,
				"message": "Incorrect request content type"
			};
		}
		return {
			"type": 0
		}
	}


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

	async getBalance(req: Request, res: Response): Promise<object> {
		let headerCheck: object = this.checkHeaders(req);
		if (headerCheck["type"] != 0) {
			return headerCheck;
		}
		let accountNum: number = parseInt(req.query.account.toString());
		let data: Account[] = await sql<Account[]>`select * from account where account_number=${accountNum}`;
		let account: Account = data[0];
		let accountType: Type[] = await sql<Type[]>`select * from type where type_id=${account.type_id}`;

		let transactions: Transaction[] = await sql<Transaction[]>`select * from transaction where sender_account=${account.account_number} or receiver_account=${account.account_number}`;

		let accountData: AccountData = {
			account_number: account.account_number,
			balance: account.amount,
			green_score: account.greenscore,
			permissions: accountType[0].type_name,
			transactions: transactions
		};

		return {
			"type": 0,
			"message": "Success",
			"account_data": accountData,
		}
	}
}