import { ApiGatewayManagementApi } from '@aws-sdk/client-apigatewaymanagementapi';

import { Transaction } from './db';

export const apig = new ApiGatewayManagementApi({
	endpoint: process.env.APIG_ENDPOINT
	// endpoint: "http://localhost:3001"
});

export interface AccountData {
	account_number: number,
	name: string,
	balance: number,
	permissions: string,
	has_offers: boolean,
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