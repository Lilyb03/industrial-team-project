import { Company, Transaction } from './db';

export interface AccountData {
	account_number: number,
	balance: number,
	permissions: string,
	green_score: number,
	transactions: Array<Transaction>
}

export interface AccountDetails {
	account_number: number,
	account_type: string,
	name: string,
	last_name: string,
	company: CompanyData
}

export interface CompanyData {
	company_name: string,
	spending_category: string,
	carbon_emissions: number,
	waste_management: number,
	sustainability_practices: number,
	rag_score: number,
	account_number: number,
}