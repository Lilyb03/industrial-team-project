import { Transaction } from './db';

export interface AccountData {
	account_number: number,
	balance: number,
	permissions: string,
	green_score: number,
	transactions: Array<Transaction>
}