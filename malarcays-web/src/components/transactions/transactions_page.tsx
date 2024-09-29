import React, { useState, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import '../../index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Transaction } from './transaction';
import { TransactionInterface, AccountData, empty_account, formatOptions } from '../../services/api';

function formatBalance(balance: number) {
  return "£" + (balance / 100).toLocaleString('en', formatOptions);
}


function TransactionModal(props: any) {
  const { transaction } = props;

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Transaction Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-start">
        <h4>REF: {transaction.reference}</h4>
        <p className="text-start">Sender: {transaction.sender_name}</p>
        <p className="text-start">Recipient: {transaction.receiver_name}</p>
        <p className="text-start">Amount: {formatBalance(transaction.amount)}</p>
        <p className="text-start">Green Score: {transaction.greenscore}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export function TransactionsPage({ accountData, setAccountData, setPage }: { accountData: AccountData, setAccountData: (data: AccountData) => void, setPage: (pageNumber: number) => void }) {
  const [modalShow, setModalShow] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [sortOption, setSortOption] = useState('1');

  const handleItemClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setModalShow(true);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };


  const sortedTransactions = [...accountData.transactions].sort((transactionsInterfaceA, transactionsInterfaceB) => {
    if (sortOption === '1') {
      return transactionsInterfaceB.date_time - transactionsInterfaceA.date_time;
    } else if (sortOption === '2') {
      return (transactionsInterfaceB.greenscore || 0) - (transactionsInterfaceA.greenscore || 0);
    } else if (sortOption === '3') {
      return (transactionsInterfaceA.greenscore || 0) - (transactionsInterfaceB.greenscore || 0);
    }
    return 0;
  });

  for (const t of sortedTransactions) {
    console.log(t.date_time);
  }

  return (
    <>
      <Stack gap={2}>
        <p id='accNum'>Account: <strong>{accountData.account_number.toString().padStart(9, '0')}</strong></p>
        <Container className='d-grid' id='box'>
          <h4>Account Balance:</h4>
          <h2 id='admTotal'>{formatBalance(accountData.balance)}</h2>
          <Button id='butt' variant="primary" className='mb-2' onClick={() => setPage(4)}>Make Payment</Button>
        </Container>
        <Container className='ml-3 mr-3 p-3' id='box'>
          <Form.Select aria-label="Sort Options" style={{ cursor: 'pointer' }} onChange={handleSortChange}>
            <option value="1">Recent</option>
            <option value="2">Highest Score</option>
            <option value="3">Lowest Score</option>
          </Form.Select>

          <ListGroup as='ul'>
            {
              sortedTransactions.map((object: any, i: number) => (
                <ListGroup.Item
                  action
                  key={i}
                  onClick={() => handleItemClick(object)}
                >
                  <Transaction
                    displayName={object.sender_account == accountData.account_number
                      ? object.receiver_name
                      : object.sender_name}
                    reference={object.reference}
                    amount={object.amount}
                    RAG={object.greenscore}
                    isInbound={object.receiver_account == accountData.account_number}
                  />
                </ListGroup.Item>
              ))
            }
          </ListGroup>
        </Container>
      </Stack>

      {selectedTransaction && (
        <TransactionModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
}
