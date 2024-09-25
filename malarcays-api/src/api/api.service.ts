import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { sql, Account, Type, Transaction, Company } from './db';
import { AccountData, AccountDetails, CompanyData } from './api';

@Injectable()
export class ApiService {
	checkHeaders(req: Request): object {
		/** 
		* Function used to check headers are correct
		* @param {Request} req - express request object
		* @return {object} returned json object containing error message if appropriate
		*/

		// check content-type header
		if (req.method == "POST" && req.headers["content-type"] != "application/json") {
			return {
				"type": 1,
				"message": "Incorrect request content type"
			};
		}

		// all is good, return success
		return {
			"type": 0
		}
	}
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

	async getBalance(req: Request, res: Response): Promise<object> {
		/** 
		* Function to get the balance of an account
		* @param {Request} req - express request object
		* @param {Response} res - express response object
		* @return {Promise<object>} promise to object to be returned to the client
		*/

		// check the request headers
		let headerCheck: object = this.checkHeaders(req);
		if (headerCheck["type"] != 0) {
			return headerCheck;
		}

		// convert the query account number into something useful
		let accountNum: number = parseInt(req.query.account.toString());

		// query the database for account data
		let data: Account[] = await sql<Account[]>`SELECT * FROM account INNER JOIN type ON account.type_id=type.type_id WHERE account_number=${accountNum};`;
		let account: Account = data[0];

		// query the database for transaction data
		let transactions: Transaction[] = await sql<Transaction[]>`SELECT * FROM transaction WHERE sender_account=${account.account_number} OR receiver_account=${account.account_number};`;

		// put together AccountData object to be returned to the client
		let accountData: AccountData = {
			account_number: account.account_number,
			balance: account.amount,
			green_score: account.greenscore,
			permissions: account.type_name,
			transactions: transactions
		};

		// return success
		return {
			"type": 0,
			"message": "Success",
			"account_data": accountData,
		}
	}

	async accountSearch(req: Request, res: Response): Promise<object> {
		/** 
		* Function to search for an account based on account number or name
		* @param {Request} req - express request object
		* @param {Response} res - express response object
		* @return {Promise<object>} promise to object to be returned to the user
		*/

		// check the request headers
		let headerCheck: object = this.checkHeaders(req);
		if (headerCheck["type"] != 0) { return headerCheck; }

		// create blank query
		let query: any = sql``;

		// handle if search based on account number is requested
		if ("account" in req.query) {
			// convert account number from query into something useful
			let accountNum: number = parseInt(req.query.account.toString());

			// add to query
			query = sql`${query} account.account_number=${accountNum}`;
		}

		// handle if search based on name is requested
		if ("name" in req.query) {
			// add 'or' to query if both name and account are requested
			if ("account" in req.query) { query = sql`${query} or `; }

			// convert name from query into something useful
			let name: string = req.query.name.toString();

			// add to query
			query = sql`${query} concat(details.name, details.last_name) LIKE ${name})`;
		}


		// query database for account data, limit to 5 responses
		let data: Account[] = (await sql<Account[]>`SELECT * FROM account INNER JOIN type ON account.type_id=type.type_id INNER JOIN details ON account.details_id=details.details_id WHERE ${query};`).slice(0, 4);

		// create new array of account details objects
		let accountData: AccountDetails[] = new Array<AccountDetails>();

		// convert account data objects into account details objects and
		// request additional company details
		for (const a of data) {
			let d: AccountDetails = {
				account_number: a.account_number,
				account_type: a.type_name,
				name: a.name,
				last_name: a.last_name,
				company: null
			};

			if (d.account_type === "company") {
				let company: Company = (await sql<Company[]>`SELECT * FROM company WHERE company_id=${a.company_id};`)[0];
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

		// return account details
		return {
			"type": 0,
			"message": "Success",
			"accounts": accountData
		}
	}

	async companySearch(req: Request, res: Response): Promise<object> {
		/** 
		* Function to search for companies based on spending category
		* @param {Request} req - express request object
		* @param {Response} res - express response object
		* @return {Promise<object>} promise to object response for client
		*/

		let headerCheck: object = this.checkHeaders(req);
		if (headerCheck["type"] != 0) { return headerCheck; }

		let spending_category: string = req.query.category.toString()

		let data: Company[] = await sql<Company[]>`SELECT company.spending_category, company.carbon, company.waste, company.sustainability, company.greenscore, account.account_number FROM company INNER JOIN account ON company.details_id=account.details_id WHERE company.spending_category LIKE ${spending_category} ORDER BY company.greenscore DESC;`;

		return {
			"type": 0,
			"message": "Success",
			"data": data
		}
	}

	async createTransaction(req: Request, res: Response): Promise<object> {
		let headerCheck: object = this.checkHeaders(req);
		if (headerCheck["type"] != 0) { return headerCheck; }

		let transactionData: Transaction = {
			...req.body
		};

		let accountData: Account[] = await sql<Account[]>`SELECT * FROM account INNER JOIN type ON account.type_id=type.type_id WHERE account.account_number=${transactionData.sender_account} OR account.account_number=${transactionData.receiver_account} ORDER BY array_position(array(${transactionData.sender_account}, ${transactionData.receiver_account}), account.account_number);`;

		if ((accountData.length != 2 && transactionData.sender_account != 0) || accountData.length == 0) {
			return {
				"type": 1,
				"message": "Invalid account number(s)"
			}
		}

		let senderAccount: Account;
		let receiverAccount: Account;

		if (transactionData.sender_account === 0) {
			receiverAccount = accountData[0];
			receiverAccount.amount += transactionData.amount;
		} else {
			senderAccount = accountData[0];
			receiverAccount = accountData[1];

			if (senderAccount.amount < transactionData.amount) {
				return {
					"type": 1,
					"message": "Insufficient Funds",
					"data": null
				}
			}

			senderAccount.amount -= transactionData.amount;
			receiverAccount.amount += transactionData.amount;
		}

		let greenscore: number;

		if (receiverAccount.type_name === "company") {
			let company: Company = (await sql<Company[]>`SELECT company.greenscore, account.account_number FROM account INNER JOIN company ON company.company_id=account.company_id WHERE account_number=${receiverAccount.account_number};`)[0];
			greenscore = (6 * company.greenscore * Math.log2((transactionData.amount / 500) + 1));
		}
		transactionData.greenscore = greenscore;

		for (const a of accountData) {
			let queryRes = await sql`UPDATE account SET amount=${a.amount}${a.account_number === transactionData.sender_account ? sql`, greenscore = greenscore + ${greenscore ? greenscore : 0}` : sql``} WHERE account_number=${a.account_number}`;
		}

		await sql`INSERT INTO transaction (sender_account, receiver_account, amount, date_time, greenscore) VALUES (${transactionData.sender_account}, ${transactionData.receiver_account}, ${transactionData.amount}, now(), ${greenscore ? greenscore : 0})`;
		return {
			"type": 0,
			"message": "Success",
			"data": transactionData
		}
	}
}