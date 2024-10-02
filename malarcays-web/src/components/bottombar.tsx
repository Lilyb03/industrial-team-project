import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { AccountData, empty_account } from '../services/api.ts';

export function BottomBar({ setPage, setLoggedIn, setDetails }: { setPage: (pageNumber: number) => void, setLoggedIn: (logged: boolean) => void, setDetails: (details: AccountData) => void }) {

  const handleSignOut = () => {
    setDetails(empty_account);
    setLoggedIn(false);
  };

  return (
    <>
      <Navbar className="bg-body-secondary fixed-bottom">
        <Container>
          <Button variant="secondary" onClick={() => setPage(0)}>Profile</Button>
          <Button variant="secondary" onClick={() => setPage(1)}>Activity</Button>
          <Button variant="secondary" onClick={() => setPage(2)}>Settings</Button>
          <Button variant="secondary" onClick={() => setPage(3)}>More</Button>
          <Button variant="outline-danger" onClick={handleSignOut}>Sign out</Button>
        </Container>
      </Navbar>
    </>
  );
}
