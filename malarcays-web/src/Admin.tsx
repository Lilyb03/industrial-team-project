import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AccountData } from './services/api';

export function getUserByAccount(accountNumber: string) {
  const usersURL = `https://api.malarcays.uk/search/account?account=${accountNumber}`;
  return fetch(usersURL, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
}

export function AdminPage() {
  const [users, setUsers] = useState<AccountData[]>([]);
  const [searchAccount, setSearchAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [isCompany, setIsCompany] = useState(false);

  const handleSearch = (event: any) => {
    event.preventDefault();
    setLoading(true);
    getUserByAccount(searchAccount).then((res) => {
      if (res && res.accounts) {
        setUsers(Array.isArray(res.accounts) ? res.accounts : [res.accounts]);
        const accountNumber = parseInt(searchAccount, 10);
        setIsCompany(accountNumber >= 1 && accountNumber <= 68);
      }
      setLoading(false);
    });
  };

    return (
    <>
      <Container className="vh-100 mt-5">
        <h2 className="mb-4">Admin Dashboard - Search Account by Number</h2>

        <Form onSubmit={handleSearch} className="mb-4">
          <Form.Group controlId="searchAccount">
            <Form.Label>Enter Account Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Account Number"
              value={searchAccount}
              onChange={(e) => setSearchAccount(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Search
          </Button>
        </Form>

        {loading && <p>Loading...</p>}

        </Container>
    </>
}

export default AdminPage;
