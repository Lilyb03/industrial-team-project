import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { SuccessModal } from './modal_success';
import { FailModal } from './modal_fail';
import { AccountData, executeTransaction } from '../../services/api';

function makePaymentCall(accountNumber: string, recipient: string, transactionAmount: number, reference: string, setSuccess: (showSuccess: boolean) => void, setFail: (showFail: boolean) => void, setClientError: (message: string) => void, accountData: AccountData, setAccountData: (data: AccountData) => void) {

  const transactionURL = "https://api.malarcays.uk/transaction/";

  console.log(accountNumber, transactionAmount, recipient, reference);

  fetch(transactionURL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: `{"sender":` + accountNumber
      + `,"recipient":` + recipient
      + `,"amount":` + transactionAmount
      + `,"reference": "` + reference + `"`
      + `}`
  })
    .then(res => res.json())
    .then(function (res) {
      console.log(res);
      if (res.type == 0) {
        console.log("here");
        setAccountData(executeTransaction(res.data, accountData));
        setSuccess(true);
      } else {
        setClientError("Something went wrong with your payment.")
        setFail(true);
      }
    })
}

function Payment({ setPage, accountData, setAccountData }: { setPage: (pageNumber: number) => void, accountData: AccountData, setAccountData: (data: AccountData) => void }) {

  const [payeeName, setPayeeName] = useState("");
  const [paymentAmt, setPaymentAmt] = useState(0);
  const [showSuccess, setSuccess] = useState(false);
  const [showFail, setFail] = useState(false);
  const [clientError, setClientError] = useState("We don't know what happened here. Try again.");

  const handleSubmit = (event: any) => {
    event.preventDefault();

    //these grab the inputs from the form. use entry.payee entry.acc and entry.amt to get the values
    let form = event.target;
    let formData = new FormData(form);
    let entry = Object.fromEntries(formData.entries());

    //
    let transactionAmount = Math.floor(parseFloat(String(entry.amt)) * 100);
    if (entry.payee === '' || entry.acc === '' || transactionAmount <= 0 || entry.ref === '') {

      setClientError("One or more fields was empty.");
      setFail(true);
      //alert stops the thing make more professional later
    } else {
      //convert to pence
      // transactionAmount = (transactionAmount * 100);

      //check account number against payee name
      const checkPayee = "https://api.malarcays.uk/search/account?account=" + entry.acc;

      fetch(checkPayee)
        .then((resp) => resp.json())
        .then(function (data) {
          const fullName = [data.accounts[0].name, data.accounts[0].last_name].join(" ").trim();
          console.log(fullName);
          console.log(entry.payee);
          if (fullName == entry.payee) {
            setPayeeName(entry.payee);
            setPaymentAmt(transactionAmount / 100);
            makePaymentCall(accountData.account_number.toString(), String(entry.acc), transactionAmount, String(entry.ref), setSuccess, setFail, setClientError, accountData, setAccountData);

          } else {
            setClientError("One or more payment details was incorrectly entered.")
            setFail(true);
          }
        })
    }

  }



  return (
    <>
      <Stack gap={2}>
        {/* should send user back to main */}
        <Button className='m-3' id='backbutt' variant="light" onClick={() => setPage(0)}><Image src='/img/back.svg' /></Button>

        <Container className='ml-3 mr-3 d-grid p-3' id='box'>
          <h2>Make a Payment</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Control className="mt-2 mb-2" name='payee' type="text" placeholder="Payee Name" />
            <Form.Control className="mt-2 mb-2" name='acc' type="text" placeholder="Payee Account Number" />
            <InputGroup className="mt-2 mb-2">
              <InputGroup.Text>£</InputGroup.Text>
              <Form.Control name='amt' type="number" placeholder="Amount" step="0.01" />
            </InputGroup>
            <Form.Control className="mt-2 mb-2" name='ref' type="text" placeholder="Payment Reference" />
            <Button id='butt' className='mt-3' variant='primary' type='submit'>Continue</Button>
          </Form>
        </Container>
      </Stack>

      <SuccessModal payee={payeeName} amount={paymentAmt} show={showSuccess} setPage={setPage} />
      <FailModal setPage={setPage} message={clientError} show={showFail} />
    </>
  )
}

export default Payment