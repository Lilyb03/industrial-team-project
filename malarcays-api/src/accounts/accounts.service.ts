import { Injectable } from '@nestjs/common';
import { sql } from '../utils/db';
import { CreateAccountsDTO } from './dtos/createAccounts.dto';

@Injectable()
export class AccountsService {
  async createAccount(createAccountsDto: CreateAccountsDTO) {
    const { name, lastName, type_id, spending_category, amount } = createAccountsDto;

    const allDetailsIds = await sql`
        SELECT details_id FROM details;
      `;

    const allType = await sql`
        SELECT * FROM type;
      `;

    const allAccountIds = await sql`
        SELECT account_number FROM account;
      `;

    const accountId = allAccountIds.length + 1;

    const detailsId = allDetailsIds.length + 1;


    const detailsResult = await sql`
      INSERT INTO details (details_id, name, last_name)
      VALUES (${detailsId}, ${name}, ${lastName || null}) 
    `;

    let createdAccount;


    if (type_id === 'COMPANY') {

      const allCompanyIds = await sql`
        SELECT company_id FROM company;
      `;

      const companyId = allCompanyIds.length + 1;

      const companyResult = await sql`
        INSERT INTO company (company_id, details_id, spending_category)
        VALUES (${companyId}, ${detailsId}, ${spending_category})
        RETURNING company_id;
      `;

      // const companyId = companyResult[0].company_id;

      createdAccount = await sql`
        INSERT INTO account (account_number, details_id, type_id, amount, company_id)
        VALUES (${accountId}, ${detailsId}, '2', ${amount}, ${companyId})
        RETURNING account_number;
      `;
    } else {



      createdAccount = await sql`
        INSERT INTO account (account_number, details_id, type_id, amount)
        VALUES (${accountId}, ${detailsId}, '1', ${amount})
        RETURNING account_number;
      `;
    }

    return createdAccount;
  }

  async login(name: string) {
    try {

      const rows = await sql`
        SELECT * FROM account a
        JOIN details d ON a.details_id = d.details_id
        WHERE d.name = ${name}
      `;

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      throw new Error(`Error fetching account: ${error.message}`);
    }
  }
}
