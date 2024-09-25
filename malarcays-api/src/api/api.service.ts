import { Injectable } from '@nestjs/common';
import { sql, Account, Details } from './db';

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
			};
		} else {
			return {
				"type": 1,
				"message": "Database is down",
			};
		}
	}

	async createUser(username: string, lastName: string, hashedPassword: string, initialBalance: number): Promise<any> {
		try {
			const [newDetails] = await sql<Details[]>`
				INSERT INTO details ("name", "lastName", "password")
				VALUES (${username}, ${lastName}, ${hashedPassword})
				RETURNING details_id`;

			const [newAccount] = await sql<Account[]>`
        INSERT INTO account (details_id, type_id, amount)
        VALUES (${newDetails.details_id}, 0, ${initialBalance})
        RETURNING account_number, details_id, company_id, amount`;

			return newAccount;
		} catch (error) {
			throw new Error('Error creating user: ' + error.message);
		}
	}

	async getUserByUsername(username: string): Promise<any> {
		try {
			const [user] = await sql<Details[]>`
        SELECT * FROM details WHERE name = ${username}`;

			if (!user) {
				throw new Error('User not found');
			}

			const [account] = await sql<Account[]>`
        SELECT * FROM account WHERE details_id = ${user.details_id}`;

			return { ...user, ...account };
		} catch (error) {
			throw new Error('Error fetching user: ' + error.message);
		}
	}
}
