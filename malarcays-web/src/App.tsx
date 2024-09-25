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

/**
 *  TODO: figure out how to type switchPage so that TS doesn't give errors
 */
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
  ) 
}

function MainPage({page}: {page: number}){

  switch(page) {
    case 0:
      return (
        <>
        <h1>first page</h1>
        </>
      )
    break;
    case 1:
      return (
        <>
        <h1>second page</h1>
        </>
      )
    break;
    case 2:
      return (
        <>
        <h1>third page</h1>
        </>
      )
    break;
    case 3:
      return (
        <>
        <h1>fourth page</h1>
        </>
      )
    break;
  }
  
}

function App() {

  const [page, setPage] = useState(0);

  return (
    <>
      <header>
        <TopBar />
      </header>
      <body>
        <MainPage page={page} />
      </body>
      <footer>
        <BottomBar setPage={setPage}/>
      </footer>
    </>
  )
}

export default App
