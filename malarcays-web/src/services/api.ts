
export interface TransactionInterface {
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

export interface AccountData {
  account_number: number,
  name: string,
  balance: number,
  permissions: string,
  green_score: number,
  has_offers: boolean,
  transactions: Array<TransactionInterface>
}

export let empty_account: AccountData = {
  account_number: 0,
  name: "",
  balance: 0,
  permissions: "",
  green_score: 0,
  has_offers: false,
  transactions: []
}

export let formatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
};

export function executeTransaction(transaction: TransactionInterface, data: AccountData): AccountData {
  let accountData: AccountData = { ...data };
  accountData.transactions.push(transaction);

  if (transaction.sender_account == accountData.account_number) {
    accountData.balance -= transaction.amount;
    accountData.green_score += transaction.greenscore || 0;
  }

  if (transaction.receiver_account == accountData.account_number) {
    accountData.balance += transaction.amount;
  }

  return accountData;
}