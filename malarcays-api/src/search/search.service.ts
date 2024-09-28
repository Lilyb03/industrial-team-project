import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { sql, Account, Company } from '../utils/db';
import { AccountDetails, CompanyData } from '../utils/api';
import { AccountDTO } from './dtos/account.dto';
import { CompanyDTO } from './dtos/company.dto';

@Injectable()
export class SearchService {
  async accountSearch(body: AccountDTO, res: Response): Promise<object> {
    /** 
    * Function to search for an account based on account number or name
    * @param {Request} req - express request object
    * @param {Response} res - express response object
    * @return {Promise<object>} promise to object to be returned to the user
    */

    // create blank query
    let query: any = sql``;

    // ensure at least one of account or name is passed
    if (!(body.account || body.name)) {
      throw new Error("At least one of 'name' or 'account' must be present");
    }

    // handle if search based on account number is requested
    if (body.account) {
      // convert account number from query into something useful
      let accountNum: number = body.account;

      // add to query
      query = sql`${query} account.account_number=${accountNum}`;
    }

    // handle if search based on name is requested
    if (body.name) {
      // add 'or' to query if both name and account are requested
      if (body.account) { query = sql`${query} or `; }

      // convert name from query into something useful
      let name: string = body.name;

      // add to query
      query = sql`${query} concat(details.name, details.last_name) LIKE ${name})`;
    }

    // query database for account data, limit to 5 responses
    let data: Account[] = (await sql<Account[]>`SELECT * FROM account INNER JOIN type ON account.type_id=type.type_id INNER JOIN details ON account.details_id=details.details_id WHERE ${query};`).slice(0, 4);

    // create new array of account details objects
    let accountData: AccountDetails[] = new Array<AccountDetails>();

    // convert account data objects into account details objects and
    // request additional company details
    for (const a of data) {
      let d: AccountDetails = {
        account_number: a.account_number,
        account_type: a.type_name,
        name: a.name,
        last_name: a.last_name,
        company: null
      };

      if (d.account_type === "company") {
        let companies: Company[] = await sql<Company[]>`SELECT * FROM company WHERE company_id=${a.company_id};`;

        if (companies.length === 0) {
          throw new Error("Company request returned zero companies, database broken");
        }

        let c: CompanyData = {
          company_name: a.name,
          spending_category: companies[0].spending_category,
          carbon_emissions: companies[0].carbon,
          waste_management: companies[0].waste,
          sustainability_practices: companies[0].sustainability,
          rag_score: companies[0].greenscore,
          account_number: a.account_number
        }
        d.company = c;
      }

      accountData.push(d);
    }

    // return account details
    return {
      "type": 0,
      "message": "Success",
      "accounts": accountData
    }
  }

  async companySearch(body: CompanyDTO, res: Response): Promise<object> {
    /** 
    * Function to search for companies based on spending category
    * @param {Request} req - express request object
    * @param {Response} res - express response object
    * @return {Promise<object>} promise to object response for client
    */

    let spending_category: string = body.category;

    let data: Company[] = await sql<Company[]>`SELECT company.spending_category, company.carbon, company.waste, company.sustainability, company.greenscore, account.account_number FROM company INNER JOIN account ON company.details_id=account.details_id WHERE company.spending_category LIKE ${spending_category} ORDER BY company.greenscore DESC;`;

    return {
      "type": 0,
      "message": "Success",
      "data": data
    }
  }

}
