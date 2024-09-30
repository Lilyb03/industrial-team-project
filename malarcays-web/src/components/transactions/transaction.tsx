import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../index.css';

export function Transaction({ displayName, reference, amount, RAG, isInbound }: { displayName: string, reference: string, amount: number, RAG: number, isInbound: boolean }) {


    var imgType: string;
    var variantType: string;

    if (RAG < 0) {
        imgType = '../../../img/flat.svg';
        variantType = 'light'
    }
    else if (RAG < 0.5) {
        imgType = '../../../img/down.svg';
        variantType = 'danger';
    } else if (RAG > 0.5) {
        imgType = '../../../img/up.svg';
        variantType = 'success';
    } else {
        imgType = '../../../img/flat.svg';
        variantType = 'warning';
    }

    return (
        <ListGroup.Item className="overflow-auto" id='perchText' as='li' variant={variantType}>
            <Row>
                <Col xs={10}>
                    <strong>{isInbound ? '+' : '-'}£{amount / 100}</strong> {displayName} - {reference}
                </Col>
                <Col>
                    <Image id='img' src={imgType} roundedCircle />
                </Col>
            </Row>
        </ListGroup.Item>
    );
}