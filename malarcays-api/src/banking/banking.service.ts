import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { sql, Account, Company, Transaction } from '../utils/db';
import { AccountData } from '../utils/api';

@Injectable()
export class BankingService {
  async getBalance(req: Request, res: Response): Promise<object> {
    /** 
    * Function to get the balance of an account
    * @param {Request} req - express request object
    * @param {Response} res - express response object
    * @return {Promise<object>} promise to object to be returned to the client
    */

    // check the request headers
    // let headerCheck: object = this.checkHeaders(req);
    // if (headerCheck["type"] != 0) {
    //   return headerCheck;
    // }

    // convert the query account number into something useful
    let accountNum: number = parseInt(req.query.account.toString());

    // query the database for account data
    let data: Account[] = await sql<Account[]>`SELECT * FROM account INNER JOIN type ON account.type_id=type.type_id WHERE account_number=${accountNum};`;
    let account: Account = data[0];

    // query the database for transaction data
    let transactions: Transaction[] = await sql<Transaction[]>`SELECT * FROM transaction WHERE sender_account=${account.account_number} OR receiver_account=${account.account_number};`;

    // put together AccountData object to be returned to the client
    let accountData: AccountData = {
      account_number: account.account_number,
      balance: account.amount,
      green_score: account.greenscore,
      permissions: account.type_name,
      transactions: transactions
    };

    // return success
    return {
      "type": 0,
      "message": "Success",
      "account_data": accountData,
    }
  }


  async createTransaction(req: Request, res: Response): Promise<object> {
    // let headerCheck: object = this.checkHeaders(req);
    // if (headerCheck["type"] != 0) { return headerCheck; }

    let transactionData: Transaction = {
      ...req.body
    };

    let accountData: Account[] = await sql<Account[]>`SELECT * FROM account INNER JOIN type ON account.type_id=type.type_id WHERE account.account_number=${transactionData.sender_account} OR account.account_number=${transactionData.receiver_account} ORDER BY array_position(array(${transactionData.sender_account}, ${transactionData.receiver_account}), account.account_number);`;

    if ((accountData.length != 2 && transactionData.sender_account != 0) || accountData.length == 0) {
      return {
        "type": 1,
        "message": "Invalid account number(s)"
      }
    }

    let senderAccount: Account;
    let receiverAccount: Account;

    if (transactionData.sender_account === 0) {
      receiverAccount = accountData[0];
      receiverAccount.amount += transactionData.amount;
    } else {
      senderAccount = accountData[0];
      receiverAccount = accountData[1];

      if (senderAccount.amount < transactionData.amount) {
        return {
          "type": 1,
          "message": "Insufficient Funds",
          "data": null
        }
      }

      senderAccount.amount -= transactionData.amount;
      receiverAccount.amount += transactionData.amount;
    }

    let greenscore: number;

    if (receiverAccount.type_name === "company") {
      let company: Company = (await sql<Company[]>`SELECT company.greenscore, account.account_number FROM account INNER JOIN company ON company.company_id=account.company_id WHERE account_number=${receiverAccount.account_number};`)[0];
      greenscore = (6 * company.greenscore * Math.log2((transactionData.amount / 500) + 1));
    }
    transactionData.greenscore = greenscore;

    for (const a of accountData) {
      let queryRes = await sql`UPDATE account SET amount=${a.amount}${a.account_number === transactionData.sender_account ? sql`, greenscore = greenscore + ${greenscore ? greenscore : 0}` : sql``} WHERE account_number=${a.account_number}`;
    }

    await sql`INSERT INTO transaction (sender_account, receiver_account, amount, date_time, greenscore) VALUES (${transactionData.sender_account}, ${transactionData.receiver_account}, ${transactionData.amount}, now(), ${greenscore ? greenscore : 0})`;
    return {
      "type": 0,
      "message": "Success",
      "data": transactionData
    }
  }
}
