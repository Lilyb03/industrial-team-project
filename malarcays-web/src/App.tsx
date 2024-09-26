//import './App.css'
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
//import Row from 'react-bootstrap/Row';
import ProgressBar from 'react-bootstrap/ProgressBar';

function TopBar(){

  return (
    <>
    <Navbar className="bg-body-secondary">
          <Container fluid className="text-center">
            <Col>
              <ProgressBar striped variant="success" className="border" now={60}/>
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
        <h1>first page</h1>
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
