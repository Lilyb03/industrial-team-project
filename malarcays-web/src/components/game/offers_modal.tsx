import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useState} from 'react';

export function OffersModal({modalShow}: {modalShow: boolean}) {

    return (
        <>
        <Modal show={modalShow}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Transaction Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-start">
              <Row>
                  <Col>
                      <p></p>
                  </Col>
                  <Col>
                      <p></p>
                  </Col>
                  <Col>
                      <Button>Claim</Button>
                  </Col>
              </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button>Close</Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }