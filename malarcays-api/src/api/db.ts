import postgres = require('postgres');

export const sql = postgres({
	host: 'malarcaysdb.cluster-c3s60cs04s05.eu-west-1.rds.amazonaws.com',
	port: 5432,
	database: 'postgres',
	username: 'malarcays',
	password: 'malarcays1234'
});

export enum AccountTypes {
	CUSTOMER,
	COMPANY,
	ADMIN
}

export interface Company {
	company_id: number,
	details_id: number,
	spending_category: string,
	carbon: number,
	waste: number,
	sustainability: number,
	greenscore: number
}

export interface Details {
	details_id: number,
	name: string,
	lastName: string,
	password: string
}

export interface Account {
	account_number: number,
	details_id: number,
	company_id: number,
	type_id: number,
	greenscore: number,
	amount: number
}

export interface Type {
	type_id: number,
	type: AccountTypes
}

export interface Transaction {
	transaction_id: number,
	sender_account: number,
	receiver_account: number,
	amount: number,
	datetime: Date,
	greenscore: number
}