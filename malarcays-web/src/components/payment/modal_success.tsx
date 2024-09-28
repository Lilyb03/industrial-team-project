import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function SuccessModal({setPage, amount, payee, show}: {setPage: (page:number) => void, amount: number, payee: string, show: boolean}) {

  return (
    <>
      <Modal show={show} backdrop="static" keyboard={false} centered>
        <Modal.Body><h1>Success!</h1>Your payment of <strong>£{amount}</strong> to <strong>{payee}</strong> was a success.</Modal.Body>
        <Modal.Footer>
        <Button onClick={() => setPage(0)}>Return</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}