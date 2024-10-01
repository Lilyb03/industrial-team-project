import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../index.css';


export function GamePage(){
    return(
        <>
        <Container className="text-center mt-5">
            <Row><h1 id="gh">Green Level: 1</h1></Row>
            <Row><h1>XP to next: 300</h1></Row>
            <Row lg={2} className="justify-content-center"><Image src='/img/tree_levels/Tree1.svg' className="mb-3"/></Row>
            <Row className="ml-3 mr-3 justify-content-center"><Col><Button variant="success" className="disabled" disabled={true}>Offers</Button></Col></Row>
        </Container>
        </>
    )
}