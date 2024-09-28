import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';


export function LoginPage({setLoggedIn}: {setLoggedIn: (logged: boolean) => void}){

    const handleSubmit = (event: any) => {
        event.preventDefault();

        let form = event.target;
        let formData = new FormData(form);
        let entry = Object.fromEntries(formData.entries());

        const loginURL = "https://api.malarcays.uk/login/"

        //change post request when newer API version is deployed (so that)
        fetch (loginURL, {
            method: "POST",
            headers: {
              'Content-Type' : 'application/json'
            },
            body: `{"name":` + `"` + entry.name + `"`
            + `,"password":` + `"` + entry.pass + `"`
            + `}`
          })
          .then(res => res.json())
          .then(function(res){
            console.log(res);
            if (res.message == "Login successful"){
              console.log("here");
              setLoggedIn(true);
            } else {
            }
          })

    }

 return(
    <>
        {/*can't figure out how to make the box centered, will come back to when more crucial work is done*/}
        <Container className="vh-100">
      
        <Container className='ml-3 mr-3 p-3' id='box'>
        <Image src='/img/Malarcays.png' className="mb-3" fluid/>
            <h2>Sign In</h2>

            <Form onSubmit={handleSubmit}>
            <Form.Control className="mt-2 mb-2" name='acc' type="text" placeholder="Account Number"/>
            <Form.Control className="mt-2 mb-2" name='name' type="text" placeholder="Name"/>
            <Form.Control className="mt-2 mb-2" name='pass' type="password" placeholder="Password" />
            <Button id='butt' className='mt-3' variant='primary' type='submit'>Sign In</Button>
            </Form>
        </Container>
        </Container>
    </>
 )
    
}