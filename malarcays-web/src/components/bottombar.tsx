import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

export function BottomBar({ setPage }: { setPage: (pageNumber: number) => void }) {
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