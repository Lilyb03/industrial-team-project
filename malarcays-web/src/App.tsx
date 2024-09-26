//import './App.css'
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
//import Row from 'react-bootstrap/Row';
import ProgressBar from 'react-bootstrap/ProgressBar';

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

function TopBar(){

  return (
    <>
    <Navbar className="bg-body-secondary">
          <Container fluid className="text-center">
            <Col>
              <ProgressBar striped variant="success" className="border" now={CalculateGreenStuff(1200)}/>
            </Col>

            <Col>
              Hugh Mann
            </Col>
            
            <Col>
              Green Level: 1
            </Col>
          </Container>
        </Navbar>
        </>
  );
}

function BottomBar({setPage}: {setPage: (pageNumber: number) => void}) {
  return (
  <>
    <Navbar className="bg-body-secondary fixed-bottom">
      <Container>
        <Button variant="secondary" onClick={() => setPage(0)}>Profile</Button>
        <Button variant="secondary" onClick={() => setPage(1)}>Activity</Button>
        <Button variant="secondary" onClick={() => setPage(2)}>Settings</Button>
        <Button variant="secondary" onClick={() => setPage(3)}>More</Button>
      </Container>
    </Navbar>
  </>
  );
}

function MainPage({page}: {page: number}){

  switch(page) {
    case 0:
      return (
        <>
        <TransactionsPage />
        </>
      );
    break;
    case 1:
      return (
        <>
        <h1>second page</h1>
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
  }
  
}

function TransactionsPage() {

  return (
   <>
      <Stack gap={2}>
        {/* account number will need to be changed with an api call */}
        <p id='accNum'>Account: <strong>C123456</strong></p>
        <Container className='d-grid' id='box'>
          {/* also needs to be changed based on api call */}
          <h2 id='admTotal'>£10,000.00</h2>
          <Button id='butt' variant="primary" className='mb-2'>Make Payment</Button>
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
          <ListGroup.Item id='perchText' as='li' variant="danger"><strong>-£100.00</strong> Company Name <Image id='img' src="/img/down.svg" roundedCircle /></ListGroup.Item>
        </ListGroup>
        </Container>
        </Stack>
   </>
  )
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
  
  return (
    <>
      <header>
        <TopBar />
      </header>
        <MainPage page={page} />
      <footer>
        <BottomBar setPage={setPage}/>
      </footer>  
    </>
  );
}

export default App
