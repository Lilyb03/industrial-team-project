import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../index.css';


function CalculateGreenLevel(score: number) {
    return Math.floor(
      Math.pow(score, 1 / 1.6) * 0.3);
  }

function CalculateLevelDifference(score:number){
    const level = CalculateGreenLevel(score);
  
    const nextLevelBoundary = Math.pow(((level + 1) / 0.3), 1.6);

    return Math.floor(nextLevelBoundary - score);
}

export function GamePage({greenscore}: {greenscore: number}){

    const level = CalculateGreenLevel(greenscore);

    console.log(Math.floor(level/5))

    const img = "/img/tree_levels/Tree" + Math.floor(level/5) + ".svg";

    return(
        <>
        <Container className="text-center mt-5">
            <Row><h1 id="gh">Green Level: {level}</h1></Row>
            <Row><h1>XP to next: {CalculateLevelDifference(greenscore)}</h1></Row>
            <Row lg={2} className="justify-content-center"><Image src={img} className="mb-3"/></Row>
            <Row className="ml-3 mr-3 justify-content-center"><Col><Button variant="success" className="disabled" disabled={true}>Offers</Button></Col></Row>
        </Container>
        </>
    )
}