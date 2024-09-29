import { Injectable } from '@nestjs/common';
import { sql } from '../utils/db';
import { CreateAccountsDTO } from './dtos/createAccounts.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AccountsService {
  async createAccount(createAccountsDto: CreateAccountsDTO) {
    //function to create an account

    const { name, lastName, type_id, spending_category, amount } = createAccountsDto;


    //Get all the details ids from details table
    const allDetailsIds = await sql`
        SELECT details_id FROM details;
      `;

    // const allType = await sql`
    //     SELECT * FROM type;
    //   `;

    //get all account Ids fdrom account table
    const allAccountIds = await sql`
        SELECT account_number FROM account;
      `;


    //find the highest and add +1 so we know the index where we will insert the new data
    const accountId = allAccountIds.length + 1;
    const detailsId = allDetailsIds.length + 1;


    /*Insert the details we got from
    * @param {CreateAccountsDTO} body
    * into the dielnd table
    */
    await sql`
      INSERT INTO details (details_id, name, last_name)
      VALUES (${detailsId}, ${name}, ${lastName || null}) 
    `;

    let createdAccount;


    //We check the type of the account we want to create
    if (type_id === 'COMPANY') {

      //Again we get all company ids to prevent duplication and add +1 to the length
      const allCompanyIds = await sql`
        SELECT company_id FROM company;
      `;
      const companyId = allCompanyIds.length + 1;

      //Insert the data from the dto into company table
      await sql`
        INSERT INTO company (company_id, details_id, spending_category)
        VALUES (${companyId}, ${detailsId}, ${spending_category})
        RETURNING company_id;
      `;


      //and finally create the account from data from dto if its a company
      createdAccount = await sql`
        INSERT INTO account (account_number, details_id, type_id, amount, company_id)
        VALUES (${accountId}, ${detailsId}, '2', ${amount}, ${companyId})
        RETURNING account_number;
      `;
    } else {

      //create a customer account if its not a company
      createdAccount = await sql`
        INSERT INTO account (account_number, details_id, type_id, amount)
        VALUES (${accountId}, ${detailsId}, '1', ${amount})
        RETURNING account_number;
      `;
    }

    //return the created account
    return createdAccount;
  }

  async login(loginData: LoginDto) {
    try {
      /*quarry to get/fetch account data
      that match the account number given
      */
      const rows = await sql`
        SELECT * FROM account
        WHERE account_number = ${loginData.account}
      `;
      //if nothing was found return null
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (error) {
      //return the error if an error occured
      throw new Error(`Error fetching account: ${error.message}`);
    }
  }
}
