import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function FailModal({setPage, message, show}: {setPage: (page:number) => void, message: string, show: boolean}) {

  return (
    <>
      <Modal show={show} backdrop="static" keyboard={false} centered>
        <Modal.Body><h1>Something went wrong</h1> {message}</Modal.Body>
        <Modal.Footer>
        <Button onClick={() => setPage(0)}>Return</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}