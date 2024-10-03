import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';

import { Offer, AccountData } from '../../services/api';

function OffersRow({ companyName, discount, code, onClaim, index, claimedIndex }: { companyName: string, discount: number, code: string, onClaim: () => void, index: number, claimedIndex: number | null }) {
  return (
    <Row className="align-items-center">
      <Col className="overflow-visible">
        <p>{companyName}</p>
      </Col>
      <Col className="overflow-visible">
        <p>{((1 - discount) * 100).toFixed(0)}%</p>
      </Col>
      <Col className="overflow-visible">
        {index === claimedIndex ?
          <p>{code}</p> :
          <Button onClick={onClaim} disabled={index !== claimedIndex && claimedIndex != null ? true : false}>Claim</Button>
        }
      </Col>
    </Row>
  )
}

function offerClaimed(index: number, setClaimedOffer: (offer: number) => void, accountData: AccountData, setAccountData: (data: AccountData) => void) {
  // send claim request to api
  const apiCall = `https://api.malarcays.uk/claim-offer?account=${accountData.account_number}`;
  fetch(apiCall)
    .then((res) => res.json())
    .then((_res) => {
      let data = { ...accountData };
      data.has_offers = false;
      setClaimedOffer(index);
      setAccountData(data);
    });
}

export function OffersModal({ modalShow, setModalShow, offers, accountData, setAccountData }: { modalShow: boolean, setModalShow: (show: boolean) => void, offers: Array<Offer>, accountData: AccountData, setAccountData: (data: AccountData) => void }) {
  const [claimedOffer, setClaimedOffer] = useState<number | null>(null);

  return (
    <>
      <Modal show={modalShow}>
        <Modal.Header closeButton onHide={() => setModalShow(false)}>
          <Modal.Title id="contained-modal-title-vcenter">
            Offers
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-start">
          {offers.map((object, index) => {
            return (<OffersRow companyName={object.company} discount={object.discount_val} code={object.discount_code} onClaim={() => offerClaimed(index, (offer) => setClaimedOffer(offer), accountData, setAccountData)} index={index} claimedIndex={claimedOffer} key={index} />);
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}