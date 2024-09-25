import { useState } from 'react'
//import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <head>
        <title>Malarcays Demo</title>
      </head>
      <body>
      <Stack gap={2}>
        {/* account number will need to be changed with an api call */}
        <p id='accNum'>Account: <strong>C123456</strong></p>
        <Container className='ml-3 mr-3 d-grid' id='box'>
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
      </body>
    </>
  )
}

export default App
