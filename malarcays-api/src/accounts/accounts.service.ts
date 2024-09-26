import { Injectable } from '@nestjs/common';
import { sql } from '../utils/db';
import { CreateAccountsDTO } from './dtos/createAccounts.dto';

@Injectable()
export class AccountsService {
  async createAccount(createAccountsDto: CreateAccountsDTO) {
    const { name, lastName, type_id, amount } = createAccountsDto;


    const detailsResult = await sql`
      INSERT INTO details (name, last_name)
      VALUES (${name}, ${lastName || null}) 
      RETURNING details_id;
    `;

    let createdAccount;

    if (type_id === 'COMPANY') {
      const companyResult = await sql`
        INSERT INTO company (details_id)
        VALUES (${detailsResult[0].details_id})
        RETURNING company_id;
      `;

      createdAccount = await sql`
        INSERT INTO account (details_id, type_id, amount, company_id)
        VALUES (${detailsResult[0].details_id}, ${type_id}, ${amount}, ${companyResult[0].company_id})
        RETURNING account_number;
      `;
    } else {
      createdAccount = await sql`
        INSERT INTO account (details_id, type_id, amount)
        VALUES (${detailsResult[0].details_id}, ${type_id}, ${amount})
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
