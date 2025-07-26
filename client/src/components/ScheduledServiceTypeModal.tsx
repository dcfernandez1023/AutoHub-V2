import React, { useEffect, useState } from 'react';
import { ModalBaseProps } from '../types/modal';
import { ScheduledServiceType } from '../types/scheduledService';
import { Button, FormControl, FormLabel, Modal } from 'react-bootstrap';
import AppAlert from './AppAlert';
import RichTextEditor from './RichTextEditor';

interface ScheduledServiceTypeModalProps extends ModalBaseProps {
  scheduledServiceType?: ScheduledServiceType;
  loading?: boolean;
  onSave: (name: string) => void;
}

const ScheduledServiceTypeModal: React.FC<ScheduledServiceTypeModalProps> = (
  props: ScheduledServiceTypeModalProps
) => {
  const {
    title,
    show,
    scheduledServiceType: existingScheduledServiceType,
    loading,
    onSave,
    onClose,
    validationError,
  } = props;

  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (existingScheduledServiceType?.name) {
      setName(existingScheduledServiceType.name);
    }
  }, [existingScheduledServiceType]);

  return (
    <Modal
      show={show}
      onHide={() => {
        setName('');
        onClose();
      }}
    >
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        {validationError ? <AppAlert message={validationError} /> : <></>}
        <FormLabel htmlFor="scheduled-service-type-name">Name</FormLabel>
        <FormControl
          id="scheduled-service-type-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          disabled={loading}
          onClick={async () => {
            onSave(name);
          }}
        >
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScheduledServiceTypeModal;
