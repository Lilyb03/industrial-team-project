import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

function makePaymentCall(accountNumber: string, recipient: string, transactionAmount: number, reference: string){
    console.log(accountNumber);
    const transactionURL = "https://api.malarcays.uk/transaction/";

    fetch (transactionURL, {
      method: "POST",
      headers: {
        'Content-Type' : 'application/json'
      },
      body: `{"sender":` + accountNumber
      + `,"recipient":` + recipient
      + `,"amount":` + transactionAmount
      + `}`
    })
    .then(res => res.text())
    .then(res => console.log(res))
}

function Payment({setPage, accountNumber}: {setPage: (pageNumber: number) => void, accountNumber: string}){
    const handleSubmit = (event: any) => {
        event.preventDefault();
    
        //these grab the inputs from the form. use entry.payee entry.acc and entry.amt to get the values
        let form = event.target;
        let formData = new FormData(form);
        let entry = Object.fromEntries(formData.entries());
        
        //down here will be some checks with the database if something is missmatched maybe there should be a warning but idk how we handle
        //new accounts, for now Ill just put in somthing that checks for empty feilds
        let transactionAmount = Math.floor(parseFloat(String(entry.amt)));
        if (entry.payee === '' || entry.acc === '' || transactionAmount <= 0)
        {
          
          alert('One or more entries are invalid');
          //alert stops the thing make more professional later
        }

        //convert to pence
        transactionAmount = (transactionAmount*100);

        //check account number against payee name
        const checkPayee = "https://api.malarcays.uk/search/account?account=" + entry.acc;

        fetch (checkPayee)
        .then((resp) => resp.json())
        .then(function(data){
          const fullName = data.accounts[0].name + " " + data.accounts[0].last_name;
          if (fullName == entry.payee){
            makePaymentCall(accountNumber, String(entry.acc), transactionAmount, String(entry.ref));
          } else{
            console.log("Error");
          }
        })
          
      }
    
      return (
        <>
            <title>Malarcays Demo</title>

            <Stack gap={2}>
              {/* should send user back to main */}
              <Button className='m-3' id='backbutt' variant="light" onClick={() => setPage(0)}><Image src='/img/back.svg' /></Button>
              
              <Container className='ml-3 mr-3 d-grid p-3' id='box'>
              <h2>Make a Payment</h2>
                {/*these will need to remember their feilds ofc*/}
                <Form onSubmit={handleSubmit}>
                <Form.Control className="mt-2 mb-2" name='payee' type="text" placeholder="Payee Name"/>
                <Form.Control className="mt-2 mb-2" name='acc' type="text" placeholder="Payee Account Number" />
                <InputGroup className="mt-2 mb-2">
                <InputGroup.Text>£</InputGroup.Text>
                <Form.Control name='amt' type="number" placeholder="Amount" step="0.01" />
                </InputGroup>
                <Form.Control className="mt-2 mb-2" name='ref' type="text" placeholder="Payment Reference" />
                <Button id='butt' className='mt-3' variant='primary' type='submit'>Continue</Button>
                </Form>
              </Container>
            </Stack>
        </>
      )
}

export default Payment