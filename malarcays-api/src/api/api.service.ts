import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { sql, Account, Type, Transaction, Company } from './db';
import { AccountData, AccountDetails, CompanyData } from './api';

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
		let data: Account[] = await sql<Account[]>`select * from account inner join type on account.type_id=type.type_id where account_number=${accountNum}`;
		let account: Account = data[0];

		let transactions: Transaction[] = await sql<Transaction[]>`select * from transaction where sender_account=${account.account_number} or receiver_account=${account.account_number}`;

		let accountData: AccountData = {
			account_number: account.account_number,
			balance: account.amount,
			green_score: account.greenscore,
			permissions: account.type_name,
			transactions: transactions
		};

		return {
			"type": 0,
			"message": "Success",
			"account_data": accountData,
		}
	}

	async search(req: Request, res: Response): Promise<object> {
		let headerCheck: object = this.checkHeaders(req);
		if (headerCheck["type"] != 0) { return headerCheck; }

		let query: any = sql``;

		if ("account" in req.query) {
			let accountNum: number = parseInt(req.query.account.toString());
			query = sql`${query} account.account_number=${accountNum}`;
		}

		if ("name" in req.query) {
			if ("account" in req.query) { query = sql`${query} or `; }
			let name: string = req.query.name.toString();
			query = sql`${query} concat(details.name, details.last_name) like ${name})`;
		}

		let data: Account[] = (await sql<Account[]>`select * from account inner join type on account.type_id=type.type_id inner join details on account.details_id=details.details_id where ${query};`).slice(0, 4);

		let accountData: AccountDetails[] = new Array<AccountDetails>();

		for (const a of data) {
			let d: AccountDetails = {
				account_number: a.account_number,
				account_type: a.type_name,
				name: a.name,
				last_name: a.last_name,
				company: null
			};

			if (d.account_type === "company") {
				let company: Company = (await sql<Company[]>`select * from company where company_id=${a.company_id}`)[0];
				let c: CompanyData = {
					company_name: a.name,
					spending_category: company.spending_category,
					carbon_emissions: company.carbon,
					waste_management: company.waste,
					sustainability_practices: company.sustainability,
					rag_score: company.greenscore,
					account_number: a.account_number
				}
				d.company = c;
			}

			accountData.push(d);
		}

		return {
			"type": 0,
			"message": "Success",
			"accounts": accountData
		}
	}
}