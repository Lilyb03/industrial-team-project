import postgres = require('postgres');

export const sqlParams = {
	host: 'malarcaysdb.cluster-c3s60cs04s05.eu-west-1.rds.amazonaws.com',
	port: 5432,
	database: 'postgres',
	username: 'malarcays',
	password: 'malarcays1234'
}

export const sql = postgres(sqlParams);

export interface Company {
	company_id?: number,
	details_id?: number,
	spending_category?: string,
	carbon?: number,
	waste?: number,
	sustainability?: number,
	greenscore?: number,
	account_number?: number
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
	name?: string,
	last_name?: string,
	company_id: number,
	type_id: number,
	type_name?: string,
	greenscore: number,
	amount: number,
	has_offers?: boolean
}

export interface Type {
	type_id: number,
	type_name: string
}

export interface Transaction {
	transaction_id?: number,
	sender_account: number,
	receiver_account: number,
	sender_name?: string,
	receiver_name?: string,
	amount: number,
	date_time: number,
	greenscore?: number,
	reference: string
}

export interface WSConnection {
	connection_id: string,
	account: number
}

export interface Offer {
	offer_id?: number,
	discount_val: number,
	discount_code: string,
	company: string
}