import { Button, Col, Modal, Row } from 'react-bootstrap';
import { ModalBaseProps } from '../types/modal';
import AppAlert from './AppAlert';
import { JSX, useState } from 'react';
import RichTextEditor from './RichTextEditor';

interface NotesModalProps extends ModalBaseProps {
  initialContent: string;
  loading: boolean;
  onSave: (content: string) => void;
}

const NotesModal: React.FC<NotesModalProps> = (props: NotesModalProps) => {
  const {
    show,
    title,
    onClose,
    onSave,
    initialContent,
    loading,
    validationError,
  } = props;

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
        <RichTextEditor
          existingContent={initialContent}
          onSave={onSave}
          disabled={loading}
        />
      </Modal.Body>
    </Modal>
  );
};

export default NotesModal;
