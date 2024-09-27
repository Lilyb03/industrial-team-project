import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

function Payment(){
    const handleSubmit = (event) => {
        event.preventDefault();
    
        //these grab the inputs from the form. use entry.payee entry.acc and entry.amt to get the values
        let form = event.target;
        let formData = new FormData(form);
        let entry = Object.fromEntries(formData.entries());
        
        //down here will be some checks with the database if something is missmatched maybe there should be a warning but idk how we handle
        //new accounts, for now Ill just put in somthing that checks for empty feilds
        let x = String(entry.amt);
        let y = parseFloat(x);
        if (entry.payee === '' || entry.acc === '' || y <= 0)
        {
          alert('One or more entries are invalid');
          //alert stops the thing make more professional later
        }
        else
        {
          //magic happens here it should probaby replace stuff beg Lily on how to actually change the content
        }
    
      }
    
      return (
        <>
          <head>
            <title>Malarcays Demo</title>
          </head>
          <body>
            <Stack gap={2}>
              {/* should send user back to main */}
              <Button className='m-3' id='backbutt' variant="light"><Image src='/img/back.svg'></Image></Button>
              <h2>Send Payment</h2>
              <Container className='ml-3 mr-3 d-grid p-3' id='box'>
                {/*these will need to remember their feilds ofc*/}
                <Form onSubmit={handleSubmit}>
                <p id='perchText'>Payee:</p>
                <Form.Control name='payee' type="text" placeholder="Payee Name"/>
                <br />
                <p id='perchText'>Account:</p>
                <Form.Control name='acc' type="text" placeholder="Payee Account Number" />
                <br />
                <p id='perchText'>Amount:</p>
                <Form.Control name='amt' type="number" placeholder="Amount" />
                {/*idk why this doesnt stretch to fill the spot and Im too eppy to be bothered right now*/}
                <Button id='butt' className='mt-3' variant='primary' type='submit'>Continue</Button>
                </Form>
              </Container>
            </Stack>
          </body>
        </>
      )
}

export default Payment