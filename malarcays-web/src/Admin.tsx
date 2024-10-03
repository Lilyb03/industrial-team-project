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

  const [rewards, setRewards] = useState([
    { id: 1, name: 'Free Coffee', description: 'Get a free coffee with 100 points', points: 100 },
    { id: 2, name: 'Discount Voucher', description: '20% off your next purchase', points: 200 },
    { id: 3, name: 'Movie Ticket', description: 'Get a free movie ticket with 300 points', points: 300 },
    { id: 4, name: 'Free Lunch', description: 'Free lunch at a selected restaurant with 500 points', points: 500 },
  ]);
  const [editingReward, setEditingReward] = useState<number | null>(null);
  const [newRewardData, setNewRewardData] = useState({ name: '', description: '', points: 0 });

  const handleEditReward = (id: number) => {
    const rewardToEdit = rewards.find((reward) => reward.id === id);
    if (rewardToEdit) {
      setNewRewardData({ name: rewardToEdit.name, description: rewardToEdit.description, points: rewardToEdit.points });
      setEditingReward(id);
    }
  };

  const handleSaveReward = () => {
    setRewards(rewards.map((reward) => (reward.id === editingReward ? { ...reward, ...newRewardData } : reward)));
    setEditingReward(null);
    setNewRewardData({ name: '', description: '', points: 0 });
  };

  const handleDeleteReward = (id: number) => {
    setRewards(rewards.filter((reward) => reward.id !== id));
  };

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
          
          <Container className="mt-5">
          <h3 className="mb-4">Rewards Section</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Reward Name</th>
                <th>Description</th>
                <th>Points Required</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward) => (
                <tr key={reward.id}>
                  {editingReward === reward.id ? (
                    <>
                      <td><input type="text" name="name" value={newRewardData.name} onChange={handleRewardInputChange} /></td>
                      <td><input type="text" name="description" value={newRewardData.description} onChange={handleRewardInputChange} /></td>
                      <td><input type="number" name="points" value={newRewardData.points} onChange={handleRewardInputChange} /></td>
                    </>
                  ) : (
                    <>
                      <td>{reward.name}</td>
                      <td>{reward.description}</td>
                      <td>{reward.points}</td>
                    </>
                  )}
                  <td>
                    {editingReward === reward.id ? (
                      <Button variant="success" className="me-2" onClick={handleSaveReward}>Save</Button>
                    ) : (
                      <Button variant="warning" className="me-2" onClick={() => handleEditReward(reward.id)}>Edit</Button>
                    )}
                    <Button variant="danger" onClick={() => handleDeleteReward(reward.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          </Container>

        </Container>
    </>
  );
}

export default AdminPage;
