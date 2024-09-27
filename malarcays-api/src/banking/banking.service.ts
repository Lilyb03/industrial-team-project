import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { EventEmitter } from 'events';
import { fromEvent, Observable, map } from 'rxjs';

import { sql, Account, Company, Transaction } from '../utils/db';
import { AccountData } from '../utils/api';
import { TransactionDTO } from './dtos/transaction.dto';
import { BalanceDTO } from './dtos/balance.dto';

@Injectable()
export class BankingService {
  private readonly transactionEmitter: EventEmitter;

  constructor() {
    this.transactionEmitter = new EventEmitter();
  }

  async getBalance(body: BalanceDTO, res: Response): Promise<object> {
    /** 
    * Function to get the balance of an account
    * @param {Request} req - express request object
    * @param {Response} res - express response object
    * @return {Promise<object>} promise to object to be returned to the client
    */

    // convert the query account number into something useful
    let accountNum: number = body.account;

    // query the database for account data
    let data: Account[] = await sql<Account[]>`SELECT * FROM account INNER JOIN type ON account.type_id=type.type_id WHERE account_number=${accountNum};`;

    if (data.length === 0) {
      return {
        "type": 1,
        "message": "Invalid account number"
      }
    }

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


  async createTransaction(body: TransactionDTO, res: Response): Promise<object> {
    /** 
    * Method to create a transaction
    * @param {TransactionDTO} body - The transaction data passed by the client
    * @param {Response} res - express response object
    * @return {Promise<object>} Promise to the json response
    */

    // convert the request body into something useful
    let transactionData: Transaction = {
      sender_account: parseInt(body.sender.toString()),
      receiver_account: parseInt(body.recipient.toString()),
      amount: body.amount
    };

    // query the database for the account data
    let accountData: Account[] = await sql<Account[]>`SELECT * FROM account INNER JOIN type ON account.type_id=type.type_id WHERE account.account_number=${transactionData.sender_account} OR account.account_number=${transactionData.receiver_account} ORDER BY array_position(array[${transactionData.sender_account}, ${transactionData.receiver_account}]::int[], account.account_number);`;

    // ensure enough accounts are returned from the database
    if ((accountData.length != 2 && transactionData.sender_account != 0) || accountData.length == 0) {
      return {
        "type": 1,
        "message": "Invalid account number(s)"
      }
    }

    // initialise sender and recipient account variables
    let senderAccount: Account;
    let receiverAccount: Account;

    // carry out transaction in account data
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

    // work out greenscore
    let greenscore: number;

    if (receiverAccount.type_name === "company") {
      let companies: Company[] = (await sql<Company[]>`SELECT company.greenscore, account.account_number FROM account INNER JOIN company ON company.company_id=account.company_id WHERE account_number=${receiverAccount.account_number};`);

      if (companies.length === 0) {
        throw new Error("Company request returned zero companies");
      }

      greenscore = (6 * companies[0].greenscore * Math.log2((transactionData.amount / 500) + 1));
    }
    transactionData.greenscore = greenscore;

    // update account data for every relevant account
    for (const a of accountData) {
      let queryRes = await sql`UPDATE account SET amount=${a.amount}${a.account_number === transactionData.sender_account ? sql`, greenscore = greenscore + ${greenscore ? greenscore : 0}` : sql``} WHERE account_number=${a.account_number}`;
    }

    // add transaction row into database table
    await sql`INSERT INTO transaction (sender_account, receiver_account, amount, date_time, greenscore) VALUES (${transactionData.sender_account}, ${transactionData.receiver_account}, ${transactionData.amount}, now(), ${greenscore ? greenscore : 0})`;

    // emit transaction data to recipient
    console.log(`sent event through channel: ${transactionData.receiver_account}`)
    this.transactionEmitter.emit(transactionData.receiver_account.toString(), transactionData);

    // return relevant object to client
    return {
      "type": 0,
      "message": "Success",
      "data": transactionData
    }
  }

  subscribeTransactionEvents(account: number): Observable<any> {
    console.log(`subscribed to events for account ${account}`);
    return fromEvent(this.transactionEmitter, account.toString()).pipe(
      map((payload) => ({
        data: JSON.stringify(payload),
      }))
    );
  }
}
