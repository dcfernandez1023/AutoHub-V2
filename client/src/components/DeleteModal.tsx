import { Button, Col, Modal, Row } from 'react-bootstrap';
import { ModalBaseProps } from '../types/modal';
import AppAlert from './AppAlert';
import { JSX } from 'react';

interface DeleteModalProps extends ModalBaseProps {
  loading?: boolean;
  modalBody: string | JSX.Element;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = (props: DeleteModalProps) => {
  const {
    show,
    title,
    onClose,
    validationError,
    loading,
    modalBody,
    onDelete,
  } = props;

  return (
    <Modal
      show={show}
      onHide={() => {
        onClose();
      }}
    >
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        {validationError ? <AppAlert message={validationError} /> : <></>}
        <Row>
          <Col>{modalBody}</Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          disabled={loading}
          onClick={() => {
            onDelete();
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
