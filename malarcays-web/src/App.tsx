//import './App.css'
import { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BottomBar } from './components/bottombar.tsx';
import { TopBar } from './components/topbar.tsx';
import { TransactionsPage } from './components/transactions/transactions_page.tsx';
import { GamePage } from './components/game/game_page.tsx';

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

import Payment from './components/payment/payment.tsx';
import { LoginPage } from './components/login/login.tsx';
// import { getDetails } from './services/details.tsx';
import { AccountData, empty_account, executeTransaction } from './services/api.ts';
import SignupPage from './components/login/Signup.tsx';
import Admin from './Admin';

function CalculateGreenLevel(score: number) {
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



function MainPage({ page, setPage, accountData, setAccountData }: { page: number, setPage: (pageNumber: number) => void, accountData: AccountData, setAccountData: (data: AccountData) => void }) {
  if (accountData.account_number != 0) {

    useEffect(() => {
      const socket = new WebSocket(`wss://0nq5sv7owa.execute-api.eu-west-1.amazonaws.com/dev?account=${accountData.account_number}`);
      // const socket = new WebSocket(`wss://localhost:3001/dev?account=${accountData.account_number}`);
      socket.onopen = () => {
        console.log("ws opened");
      };

      socket.onmessage = (msg) => {
        console.log(msg.data);
        executeTransaction(JSON.parse(msg.data), accountData, setAccountData);
      }
    }, []);
  }

  switch (page) {
    case 0:
      return (
        <>
          <TransactionsPage accountData={accountData} setPage={setPage} />
        </>
      );
      break;
    case 1:
      return (
        <>
          <GamePage greenscore={accountData.green_score} hasOffer={accountData.has_offers} accountData={accountData} setAccountData={setAccountData} />
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
          return <Admin />;
      break;
    case 4:
      return (
        <>
          <Payment setPage={setPage} accountData={accountData} setAccountData={setAccountData} />
        </>
      )
    case 5:
      return (
        <>
          <SignupPage setPage={setPage} />
        </>
      );
    default:
      return null;
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


// function setDetails(d: AccountData) {
//   details = d;
// }

function App() {
  const [page, setPage] = useState(0);

  const [details, setDetails] = useState(empty_account)

  const [loggedIn, setLoggedIn] = useState(false);


  // useEffect(() => {
  //     getDetails()
  //       .then(data => {
  //         setDetails(data)
  //       })
  // }, []);

  // console.log(details);

  if (!loggedIn && page !== 5) {
    return (
      <>
        <LoginPage setLoggedIn={setLoggedIn} setDetails={setDetails} setPage={setPage} />
      </>
    )

  } else if (!loggedIn && page === 5) {
    return (
      <>
        <SignupPage setPage={setPage} />
      </>

    )

  } return (
    <>
      <header>
        <TopBar perc={CalculateGreenStuff(details.green_score)} name={details.name} level={CalculateGreenLevel(details.green_score)} />
      </header>
      <MainPage page={page} setPage={setPage} accountData={details} setAccountData={setDetails} />
      <footer>
        <BottomBar setPage={setPage} setLoggedIn={setLoggedIn} setDetails={setDetails} />
      </footer>
    </>
  );
}

export default App
