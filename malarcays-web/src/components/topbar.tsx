import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';

export function TopBar({ perc, name, level }: {perc: number, name: string, level: number}){

    return (
      <>
      <Navbar className="bg-body-secondary">
            <Container fluid className="text-center">
              <Col>
                <ProgressBar striped variant="success" className="border" now={perc}/>
              </Col>
  
              <Col>
                {name}
              </Col>
              
              <Col>
                Green Level: {level}
              </Col>
            </Container>
          </Navbar>
          </>
    );
  }