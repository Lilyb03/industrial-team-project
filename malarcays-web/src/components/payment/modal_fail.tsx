import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function FailModal({ onExit, message, show }: { onExit: () => void, message: string, show: boolean }) {

  return (
    <>
      <Modal show={show} backdrop="static" keyboard={false} centered>
        <Modal.Body><h1>Something went wrong</h1> {message}</Modal.Body>
        <Modal.Footer>
          <Button onClick={onExit}>Return</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}