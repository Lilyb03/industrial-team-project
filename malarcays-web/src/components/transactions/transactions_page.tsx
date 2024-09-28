import { useState, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import '../../index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Transaction } from './transaction';

interface TransactionInterface {
  transaction_id?: number,
  sender_account: number,
  receiver_account: number,
  sender_name?: string,
  receiver_name?: string,
  amount: number,
  datetime?: Date,
  greenscore?: number,
  reference: string
}

interface AccountData {
  account_number: number,
  balance: number,
  permissions: string,
  green_score: number,
  transactions: Array<TransactionInterface>
}

export function TransactionsPage({ accountData, setPage }: { accountData: AccountData, setPage: (pageNumber: number) => void }) {
  let [balance, setBalance] = useState(accountData.balance);
  let [transactions, setTransactions] = useState(accountData.transactions);

  let formatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }

  return (
    <>
      <Stack gap={2}>
        {/* account number will need to be changed with an api call */}
        <p id='accNum'>Account: <strong>{accountData.account_number.toString().padStart(9, '0')}</strong></p>
        <Container className='d-grid' id='box'>
          {/* also needs to be changed based on api call */}
          <h2 id='admTotal'>£{(balance / 100).toLocaleString('en', formatOptions)}</h2>
          <Button id='butt' variant="primary" className='mb-2' onClick={() => setPage(4)}>Make Payment</Button>
        </Container>
        <Container className='ml-3 mr-3 p-3' id='box'>
          {/* in theory this will sort the transactions */}
          <Form.Select aria-label="Sort Options">
            <option value="1">Recent</option>
            <option value="2">Highest Score</option>
            <option value="3">Lowest Score</option>
          </Form.Select>
          {/* This is the list of transactions, currently there is a dummy one, this code will need to be updated based off api calls and have its color
          changed based off RAW score and icon changed as well */}
          <ListGroup as='ul'>
            {
              transactions.map((object: any, i: number) => {
                return <Transaction key={i} displayName={object.sender_account == accountData.account_number ? object.receiver_name : object.sender_name} reference={object.reference} amount={object.amount} RAG={object.greenscore} isInbound={object.receiver_account == accountData.account_number} />
              })
            }
          </ListGroup>
        </Container>
      </Stack>
    </>
  )
}