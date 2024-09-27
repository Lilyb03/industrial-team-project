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
import { getDetails } from './services/details.tsx';

const accountDetails: string = '{' +
  '"type": 0,' +
  '"message": "Success",' +
  '"account_data": {' +
    '"account_number": 91,' +
    '"balance": 1400,' +
    '"green_score": 1259,' +
    '"permissions": "customer",' +
    '"transactions": [' +
      '{' +
        '"transaction_id": 2,' +
        '"sender_account": 90,' +
        '"receiver_account": 91,' +
        '"amount": 100,' +
        '"date_time": "2024-09-25T10:50:49.834Z",' +
        '"greenscore": 0' +
      '},' +
      '{' +
        '"transaction_id": 3,' +
        '"sender_account": 90,' +
        '"receiver_account": 91,' +
        '"amount": 100,' +
        '"date_time": "2024-09-25T10:51:55.884Z",' +
        '"greenscore": 0' +
      '}' +
    ']' +
  '}' +
'}';

const Details = JSON.parse(accountDetails);

function CalculateGreenStuff(score: number){

  //find user level
  const level: number = Math.floor(
    Math.pow(score ,1/1.6) * 0.3);

  const currentLevelBoundary = Math.pow((level/0.3), 1.6);

  const nextLevelBoundary = Math.pow(((level+1)/0.3), 1.6);

  const percDiff: number = ((score - currentLevelBoundary) / (nextLevelBoundary - currentLevelBoundary)) * 100;
  
  return percDiff;
}

CalculateGreenStuff(Details.account_data.green_score);



function MainPage({page, setPage}: {page: number, setPage: (pageNumber: number) => void}){

  switch(page) {
    case 0:
      return (
        <>
        <TransactionsPage details={Details} setPage={setPage}/>
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
        <Payment setPage={setPage}/>
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

  // useEffect(() => {
  //     getDetails()
  //       .then(data => {
  //         setDetails(data)
  //       })
  // }, []);

  // console.log(details);

  return (
    <>
      <header>
        <TopBar perc={60} name={"hugh mann"} level={3} />
      </header>
        <MainPage page={page} setPage={setPage} />
      <footer>
        <BottomBar setPage={setPage}/>
      </footer>  
    </>
  );
}

export default App
