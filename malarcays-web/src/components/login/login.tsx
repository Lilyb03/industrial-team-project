import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useState } from 'react';


import { getDetails } from '../../services/details';
import { AccountData } from '../../services/api';
import { FailModal } from '../payment/modal_fail';


export function LoginPage({ setPage, setLoggedIn, setDetails }: { setPage: (pageNumber: number) => void, setLoggedIn: (logged: boolean) => void, setDetails: (details: AccountData) => any }) {
  const [showFail, setFail] = useState(false);
  const [clientError, setClientError] = useState("We don't know what happened here. Try again.");

  const handleSubmit = (event: any) => {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);
    let entry = Object.fromEntries(formData.entries());

    // console.log(parseInt(entry.acc.toString()));

    const loginURL = "https://api.malarcays.uk/login/"

    fetch(loginURL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: `{"name":` + `"` + entry.name + `"`
        + `,"account":` + parseInt(entry.acc.toString())
        + `,"password":` + `"` + entry.pass + `"`
        + `}`
    })
      .then(res => res.json())
      .then(function (res) {
        console.log(res);
        if (res.message == "Login successful") {
          console.log("here");

          getDetails(parseInt(entry.acc.toString())).then((res) => {
            if (res["type"] != 0) { console.log("something died"); return; }

            console.log(res);
            setDetails(res["account_data"]);
          });
          setLoggedIn(true);
        } else {
          setFail(true);
          setClientError("Login details were incorrect");
        }
      })

  }

  return (
    <>
      <Container className="vh-100">
        <Container className="ml-3 mr-3 p-3 translate-middle top-50 start-50 position-absolute" id="box">
          <Image src="/img/Malarcays.png" className="mb-3" fluid />
          <h2>Sign In</h2>

          <Form onSubmit={handleSubmit}>
            <FloatingLabel label="Account Number" className="mt-2 mb-2">
              <Form.Control name="acc" type="text" placeholder="Account Number" required />
            </FloatingLabel>

            <FloatingLabel label="Name" className="mt-2 mb-2">
              <Form.Control name="name" type="text" placeholder="Name" required />
            </FloatingLabel>

            <FloatingLabel label="Password" className="mt-2 mb-2">
              <Form.Control name="pass" type="password" placeholder="Password" required />
            </FloatingLabel>

            <Button id="butt" className="mt-3" variant="primary" type="submit">
              Sign In
            </Button>

            <Container>
              <h5>
                Don't have an account? Sign up here:{" "}
                <Button id="signup" className="mb-1" variant="primary" onClick={() => { setPage(5); }}>Sign Up</Button>
              </h5>
            </Container>
          </Form>
        </Container>
      </Container>

      <FailModal onExit={() => setFail(false)} message={clientError} show={showFail} />
    </>
  );

}