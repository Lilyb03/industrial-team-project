//import './App.css'
import { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BottomBar } from './components/bottombar.tsx';
import { TopBar } from './components/topbar.tsx';
import { TransactionsPage } from './components/transactions/transactions_page.tsx';

// import Stack from 'react-bootstrap/Stack';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import ListGroup from 'react-bootstrap/ListGroup';
// import Image from 'react-bootstrap/Image';
// import Button from 'react-bootstrap/Button';
// import Navbar from 'react-bootstrap/Navbar';
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
// import ProgressBar from 'react-bootstrap/ProgressBar';

import  Payment  from './components/payment/payment.tsx';
import { LoginPage } from './components/login/login.tsx';
import { getDetails } from './services/details.tsx';

const accountDetails: string = `{
  "type": 0,
  "message": "Success",
  "account_data": {
    "account_number": 91,
    "balance": 2100,
    "green_score": 1200,
    "permissions": "customer",
    "transactions": [
      {
        "transaction_id": 2,
        "sender_account": 90,
        "receiver_account": 91,
        "amount": 100,
        "date_time": "2024-09-25T09:50:49.834Z",
        "greenscore": 0,
        "sender_name": "Brittany Jimenez",
        "sender_num": 90,
        "receiver_name": "Tabitha Butler",
        "receiver_num": 91
      },
      {
        "transaction_id": 3,
        "sender_account": 90,
        "receiver_account": 91,
        "amount": 100,
        "date_time": "2024-09-25T09:51:55.884Z",
        "greenscore": 0,
        "sender_name": "Brittany Jimenez",
        "sender_num": 90,
        "receiver_name": "Tabitha Butler",
        "receiver_num": 91
      },
      {
        "transaction_id": 4,
        "sender_account": 90,
        "receiver_account": 91,
        "amount": 100,
        "date_time": "2024-09-27T10:37:32.775Z",
        "greenscore": 0,
        "sender_name": "Brittany Jimenez",
        "sender_num": 90,
        "receiver_name": "Tabitha Butler",
        "receiver_num": 91
      },
      {
        "transaction_id": 5,
        "sender_account": 90,
        "receiver_account": 91,
        "amount": 100,
        "date_time": "2024-09-27T10:41:37.950Z",
        "greenscore": 0.5,
        "sender_name": "Brittany Jimenez",
        "sender_num": 90,
        "receiver_name": "Tabitha Butler",
        "receiver_num": 91,
        "reference": "test reference"
      },
      {
        "transaction_id": 6,
        "sender_account": 90,
        "receiver_account": 91,
        "amount": 100,
        "date_time": "2024-09-27T10:42:46.838Z",
        "greenscore": 0,
        "sender_name": "Brittany Jimenez",
        "sender_num": 90,
        "receiver_name": "Tabitha Butler",
        "receiver_num": 91
      },
      {
        "transaction_id": 7,
        "sender_account": 90,
        "receiver_account": 91,
        "amount": 100,
        "date_time": "2024-09-27T10:44:48.891Z",
        "greenscore": 0.9,
        "sender_name": "Brittany Jimenez",
        "sender_num": 90,
        "receiver_name": "Tabitha Butler",
        "receiver_num": 91
      },
      {
        "transaction_id": 8,
        "sender_account": 90,
        "receiver_account": 91,
        "amount": 100,
        "date_time": "2024-09-27T10:47:45.162Z",
        "greenscore": -1,
        "sender_name": "Brittany Jimenez",
        "sender_num": 90,
        "receiver_name": "Tabitha Butler",
        "receiver_num": 91
      },
      {
        "transaction_id": 9,
        "sender_account": 91,
        "receiver_account": 90,
        "amount": 100,
        "date_time": "2024-09-27T10:55:01.162Z",
        "greenscore": 0,
        "sender_name": "Brittany Jimenez",
        "sender_num": 90,
        "receiver_name": "Tabitha Butler",
        "receiver_num": 91
      },
      {
        "transaction_id": 10,
        "sender_account": 91,
        "receiver_account": 90,
        "amount": 100,
        "date_time": "2024-09-27T10:55:47.332Z",
        "greenscore": 0,
        "sender_name": "Brittany Jimenez",
        "sender_num": 90,
        "receiver_name": "Tabitha Butler",
        "receiver_num": 91
      }
    ]
  }
}`;

const Details = JSON.parse(accountDetails);

function CalculateGreenLevel(score: number){
    return Math.floor(
      Math.pow(score, 1 / 1.6) * 0.3);
}

function CalculateGreenStuff(score: number) {
  
  const level = CalculateGreenLevel(score);

  const currentLevelBoundary = Math.pow((level / 0.3), 1.6);

  const nextLevelBoundary = Math.pow(((level + 1) / 0.3), 1.6);

  const percDiff: number = ((score - currentLevelBoundary) / (nextLevelBoundary - currentLevelBoundary)) * 100;

  return percDiff;
}

CalculateGreenStuff(Details.account_data.green_score);



function MainPage({page, setPage}: {page: number, setPage: (pageNumber: number) => void}){

  switch (page) {
    case 0:
      return (
        <>
          <TransactionsPage accountData={Details.account_data} setPage={setPage} />
        </>
      );
      break;
    case 1:
      return (
        <>
        <h1>first page</h1>
        </>
      );
      break;
    case 2:
      return (
        <>
          <h1>third page</h1>
        </>
      );
      break;
    case 3:
      return (
        <>
          <h1>fourth page</h1>
        </>
      );
    break;

    case 4:
      return (
        <>
        <Payment setPage={setPage} accountNumber={Details.account_data.account_number}/>
        </>
      )
  }

}

// function FetchUser(){
//   const apiCall = "https://api.malarcays.uk/balance?account=91";

//   fetch(apiCall)
//   .then((resp) => resp.json())
//   .then(function(data){
//     return data;
//   });
// }

function App() {
  const [page, setPage] = useState(0);

  const [details, setDetails] = useState();

  const [loggedIn, setLoggedIn] = useState(false);

  // useEffect(() => {
  //     getDetails()
  //       .then(data => {
  //         setDetails(data)
  //       })
  // }, []);

  // console.log(details);

  if (!loggedIn){
    return(
      <>
          <LoginPage setLoggedIn={setLoggedIn}/>
      </>
    )

  }

  return (
    <>
      <header>
        <TopBar perc={CalculateGreenStuff(Details.account_data.green_score)} name={Details.account_data.name} level={CalculateGreenLevel(Details.account_data.green_score)} />
      </header>
        <MainPage page={page} setPage={setPage} />
      <footer>
        <BottomBar setPage={setPage} />
      </footer>
    </>
  );
}

export default App
