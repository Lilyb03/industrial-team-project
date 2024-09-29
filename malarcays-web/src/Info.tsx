import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


//Note: I havent looked at this yet on the local server, it should be fine but you know.
 
function Info() {
    let compName = 'Company Name' 
    let date = '00/00/0000'
    let variant = 'danger'
    let amt = -1.00
  
    //changes the image for the RAW score
    let trend = 'down'
    let imgLink = '/img/' +trend+ '.svg'
    
    let score = 0;
    //math will need to be done here to make the score out of 100 instead of 10.
    let scorePer = 0;



  return (
    <>
      <head>
        <title>Malarcays Demo</title>
      </head>
      <body>
      <Stack gap={2}>
      {/* should send user back to main */}
      <Button className='m-3' id='backbutt' variant="light"><Image src='/img/back.svg'></Image></Button>
      <Container  className='ml-3 mr-3 d-grid p-3' id='box'>
      <h2>{compName}</h2>
      <Row>
        {/*here will be the breakdown of each catagory, I cant look at them rightnow though because no exel*/}
        <Col>1 of 3</Col>
        <Col>2 of 3</Col>
        <Col>3 of 3</Col>
      </Row>
      <p>Total:</p>
      <ProgressBar now={scorePer} label={`${score}`} variant='success'/>
      </Container>

    <h3>Recent Purchases:</h3>
    <Container  className='ml-3 mr-3 d-grid p-3' id='box'>
        <ListGroup as='ul'>
          <ListGroup.Item id='perchText' as='li' variant={variant}><strong>{amt}£ </strong> {date} <Image id='img' src={imgLink} roundedCircle /></ListGroup.Item>
        </ListGroup>
      </Container>
 
      {/*Recomended companies here maybe, not sure if the database has tags that can support related companies*/}
        </Stack>
      </body>
    </>
  )
}

export default Info
