//import './App.css'
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
//import ButtonGroup from 'react-bootstrap/ButtonGroup';

import Container from 'react-bootstrap/Container';
//import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function TopBar(){
  return (
    <>
    <Navbar className="bg-body-secondary">
          <Container>
            <Col>
              T
            </Col>

            <Col>
              <Row>Hugh Mann</Row>
            </Col>
            
            <Col>
            Green Level: 1
            </Col>
          </Container>
        </Navbar>
        </>
  )
}

function BottomBar(){
  return (
  <>
    <Navbar className="bg-body-secondary fixed-bottom">
      <Container>
        <Button variant="secondary">Profile</Button>
        <Button variant="secondary">Activity</Button>
        <Button variant="secondary">Settings</Button>
        <Button variant="secondary">More</Button>
      </Container>
    </Navbar>
  </>
  ) 
}

function App() {
  return (
    <>
      <header>
        <TopBar />
      </header>
      <body>
      </body>
      <footer>
        <BottomBar />
      </footer>
    </>
  )
}

export default App
