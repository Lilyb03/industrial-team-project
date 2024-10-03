import { Injectable } from '@nestjs/common';
import { sql } from '../utils/db';
import { CreateAccountsDTO } from './dtos/createAccounts.dto';
import { LoginDto } from './dtos/login.dto';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AccountsService {
  async createAccount(createAccountsDto: CreateAccountsDTO) {

    //function to create an account
    const { name, lastName, password, type_id, spending_category, amount } = createAccountsDto;
    const hashedPassword = CryptoJS.SHA256(password).toString();


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
      INSERT INTO details (details_id, name, last_name, password)
      VALUES (${detailsId}, ${name}, ${lastName || null}, ${(hashedPassword)}) 
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
      //hash the password using sha256
      const hashedPassword = CryptoJS.SHA256(loginData.password).toString();

      /*quarry to get/fetch account data by creating joined tables
      that match the account number given as well as the password
      */
      const rows = await sql`
          SELECT * FROM account a
          JOIN details d ON a.details_id = d.details_id
          WHERE a.account_number = ${loginData.account}
          AND d.password = ${hashedPassword}
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
