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

  const toggleRow = (account_number: number) => {
    const isRowExpanded = expandedRows.includes(account_number);
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((id) => id !== account_number));
    } else {
      setExpandedRows([...expandedRows, account_number]);
    }
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
          <Table striped bordered hover>
          <thead>
            <tr>
              <th>Account Number</th>
              <th>{isCompany ? 'Company Name' : 'Name'}</th>
              <th>{isCompany ? 'Spending Category' : 'Last Name'}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <>
                  <tr key={user.account_number}>
                    <td>{user.account_number}</td>
                    <td>{user.name}</td>
                    <td>{isCompany ? user.company?.spending_category : user.last_name}</td>
                    <td>
                      {isCompany ? (
                        <Button
                          variant="info"
                          className="me-2"
                          onClick={() => toggleRow(user.account_number)}
                        >
                          {expandedRows.includes(user.account_number) ? 'Less' : 'More Info'}
                        </Button>
                      ) : null}
                      <Button variant="warning" className="me-2">Edit</Button>
                      <Button variant="danger">Delete</Button>
                    </td>
                  </tr>

                  {isCompany && expandedRows.includes(user.account_number) && (
                    <tr key={`${user.account_number}-details`}>
                      <td colSpan={4}>
                        <strong>Additional Company Details:</strong>
                        <ul>
                          <li>Carbon Emissions: {user.company?.carbon_emissions}</li>
                          <li>RAG Score: {user.company?.rag_score}</li>
                          <li>Sustainability Practices: {user.company?.sustainability_practices}</li>
                          <li>Waste Management: {user.company?.waste_management}</li>
                        </ul>
                      </td>
                    </tr>
                  )}
                </>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No accounts found</td>
              </tr>
            )}
          </tbody>
          </Table>
        </Container>
    </>
}

export default AdminPage;
