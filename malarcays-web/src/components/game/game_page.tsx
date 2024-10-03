import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {OffersModal} from './offers_modal.tsx';
import {useState} from 'react';
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

export function GamePage({greenscore, hasOffer}: {greenscore: number, hasOffer: boolean}){

    const level = CalculateGreenLevel(greenscore);

    if(hasOffer){
        const apiCall = "https://api.malarcays.uk/search/offers";
        fetch(apiCall)
        .then((resp) => resp.json())
        .then(function(resp){
            (resp.data);
        });
    }

    var img = "/img/tree_levels/Tree1.svg";

    if (level > 25){
        img = "/img/tree_levels/Tree6.svg";
    } else{
        img = "/img/tree_levels/Tree" + (1 + Math.floor(level/5)) +".svg";
    }

    const [modalShow, setShow] = useState(false);

    return(
        <>
        <Container className="text-center mt-5">
            <Row><h1 id="gh">Green Level: {level}</h1></Row>
            <Row><h1>XP to next: {CalculateLevelDifference(greenscore)}</h1></Row>
            <Row lg={3} className="justify-content-center"><Image src={img} className="mb-3"/></Row>
            <Row className="ml-3 mr-3 justify-content-center"><Col><Button variant="success" disabled={!hasOffer} onClick={() => setShow(true)} >Offers</Button></Col></Row>
        </Container>

        <OffersModal modalShow={modalShow}/>
        </>
    )
}