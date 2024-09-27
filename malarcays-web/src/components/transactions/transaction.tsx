import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import '../../index.css';

function Transaction(companyName: string, amount: number, RAG: number){


    var imgType: string;
    var variantType: string;

    if (RAG < 0.5){
        imgType = '../../../img/down.svg';
        variantType = 'danger';
    } else if (RAG > 0.5){
        imgType = '../../../img/up.svg';
        variantType = 'success';
    } else{
        imgType = '../../../img/flat.svg';
        variantType = 'light';
    }

    return (    
        <ListGroup.Item id='perchText' as='li' variant={variantType}>
        <strong>{amount/100}</strong> {companyName}
        <Image id='img' src={imgType} roundedCircle />
        </ListGroup.Item>
    );
}