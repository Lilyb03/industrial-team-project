import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

//Note to self, check that it works on the sever because I havent done that yet.
//Image will be used eventually maybe
function Login(){

    const handleSubmit = (event) => {
        event.preventDefault();
    
        //these grab the inputs from the form.
        let form = event.target;
        let formData = new FormData(form);
        let entry = Object.fromEntries(formData.entries());
        
        //down here will be some checks with the database if something is missmatched maybe there should be a warning but idk how we handle
        //new accounts, for now Ill just put in somthing that checks for empty feilds
        if (entry.payee === '' || entry.acc === '')
        {
          alert('One or more entries are invalid');
          //alert stops the thing make more professional later
        }
        else
        {
          //magic happens here 
          //aka it moves you to the home page
        }
    
      }
    
    
      return (
        <>
          <head>
            <title>Malarcays Demo</title>
          </head>
          <body>
            <Stack gap={2}>
              <Container className='ml-3 mr-3 d-grid p-3' id='box'>
                <Form onSubmit={handleSubmit}>
                <p id='perchText'>Username:</p>
                <Form.Control name='username' type="text" placeholder="Username"/>
                <br />
                {/*This might need to be adjusted idk what to, its just a feeling. Could just get deleted*/}
                <p id='perchText'>Password:</p>
                <Form.Control name='pass' type="password" placeholder="Password" />
                <br />
                {/*idk why this doesnt stretch to fill the spot and Im too eppy to be bothered right now*/}
                <Button id='butt' className='mt-3' variant='primary' type='submit'>Login</Button>
                </Form>
              </Container>
              Logo here???
            </Stack>
          </body>
        </>
      )
}

export default Login