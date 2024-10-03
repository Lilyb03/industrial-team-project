import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Modal from 'react-bootstrap/Modal';

function SignupPage({ setPage }: { setPage: (pageNumber: number) => void }) {
  const [accountType, setAccountType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const handleAccountTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountType(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);
    let entry = Object.fromEntries(formData.entries());

    const signupURL = 'https://api.malarcays.uk/signup/';

    const requestBody: any = {
      name: entry.name,
      password: entry.password,
      type_id: parseInt(entry.type_id.toString()),
      amount: 10000,
    };

    if (entry.lastName) {
      requestBody.lastName = entry.lastName;
    }

    if (entry.spending_category) {
      requestBody.spending_category = entry.spending_category;
    }

    fetch(signupURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === 'Account created') {
          setAccountNumber(res.data[0].account_number);
          setShowModal(true);
        }
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPage(0);
  };

  return (
    <>
      <Container className="vh-100">
        <Container className="ml-3 mr-3 p-3 translate-middle top-50 start-50 position-absolute" id="box">
          <Image src="/img/Malarcays.png" className="mb-3" fluid />
          <h2>Sign Up</h2>
          <Form onSubmit={handleSubmit}>
            <FloatingLabel label="First Name" className="mt-2 mb-2">
              <Form.Control name="name" type="text" placeholder="Enter first name" />
            </FloatingLabel>
            <FloatingLabel label="Last Name" className="mt-2 mb-2">
              <Form.Control name="lastName" type="text" placeholder="Enter last name" />
            </FloatingLabel>
            <FloatingLabel label="Password" className="mt-2 mb-2">
              <Form.Control name="pass" type="password" placeholder="Enter password" />
            </FloatingLabel>

            <FloatingLabel label="Account Type" className="mt-2 mb-2">
              <Form.Select name="type_id" onChange={handleAccountTypeChange} aria-label="Select account type">
                <option value="1">Customer</option>
                <option value="2">Business</option>
              </Form.Select>
            </FloatingLabel>

            {accountType === '2' && (
              <FloatingLabel label="Category of business" className="mt-2 mb-2">
                <Form.Select name="spending_category" aria-label="Select business category">
                  <option value="Technology">Technology</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Construction">Construction</option>
                  <option value="Transport">Transport</option>
                  <option value="Telecommunications">Telecommunications</option>
                  <option value="Education">Education</option>
                  <option value="Energy">Energy</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Hospitality">Hospitality</option>
                </Form.Select>
              </FloatingLabel>
            )}

            <Button className="mt-3" variant="primary" type="submit">Sign Up</Button>
            <Container>
              <h5>
                Already have an account? Log In here:
                <Button id='login' className='mb-1' variant='primary' onClick={() => {setPage(0);}}>Log In</Button>
              </h5>
            </Container>
          </Form>
        </Container>
      </Container>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Account Created</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Your account number is: <strong>{accountNumber}</strong></p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
    </>

  );
}

export default SignupPage;
