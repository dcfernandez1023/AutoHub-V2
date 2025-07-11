import { Button, Col, Modal, Row } from 'react-bootstrap';
import { ModalBaseProps } from '../types/modal';
import AppAlert from './AppAlert';
import { JSX } from 'react';
import RichTextEditor from './RichTextEditor';

interface NotesModalProps extends ModalBaseProps {}

const NotesModal: React.FC<NotesModalProps> = (props: NotesModalProps) => {
  const { show, title, onClose, validationError } = props;

  return (
    <Modal
      show={show}
      onHide={() => {
        onClose();
      }}
      backdrop="static"
      keyboard={false}
      fullscreen
    >
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        {validationError ? <AppAlert message={validationError} /> : <></>}
        <RichTextEditor existingContent={''} onSave={() => {}} />
      </Modal.Body>
    </Modal>
  );
};

export default NotesModal;
