
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

export interface Offer {
  offer_id?: number,
  discount_val: number,
  discount_code: string,
  company: string
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

export function executeTransaction(transaction: TransactionInterface, data: AccountData, setAccountData: (data: AccountData) => void): void {
  data = executeAccounting(transaction, data);
  setAccountData(data);

  executeGreen(transaction, data)
    .then((res) => {
      setAccountData(res);
    });
}

function executeAccounting(transaction: TransactionInterface, data: AccountData): AccountData {
  let accountData: AccountData = { ...data };
  accountData.transactions.push(transaction);

  if (transaction.sender_account == accountData.account_number) {
    accountData.balance -= transaction.amount;
  }

  if (transaction.receiver_account == accountData.account_number) {
    accountData.balance += transaction.amount;
  }

  return accountData;
}

async function executeGreen(transaction: TransactionInterface, data: AccountData): Promise<AccountData> {
  await new Promise(r => setTimeout(r, 5000));

  let accountData: AccountData = { ...data };

  if (transaction.sender_account == accountData.account_number) {
    accountData.has_offers = (accountData.green_score + (transaction.greenscore || 0) > Math.ceil(accountData.green_score / 50) * 50) || accountData.has_offers;
    accountData.green_score += transaction.greenscore || 0;
    console.log(accountData.green_score, accountData.has_offers);
  }

  return accountData;
}