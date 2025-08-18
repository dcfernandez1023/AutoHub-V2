import { useEffect, useState } from 'react';
import { ModalBaseProps } from '../types/modal';
import { Button, Modal } from 'react-bootstrap';
import AppAlert from './AppAlert';
import FileUpload from './FileUpload';

export type AttachmentAction = 'upload' | 'delete';

interface AttachmentModalProps extends ModalBaseProps {
  loading: boolean;
  action: AttachmentAction | undefined;
  onCreate: (file: File | undefined) => void;
  onDelete: () => void;
}

const AttachmentModal: React.FC<AttachmentModalProps> = (
  props: AttachmentModalProps
) => {
  const {
    title,
    show,
    loading,
    action,
    onCreate,
    onDelete,
    onClose,
    validationError,
  } = props;

  const [selectedFile, setSelectedFile] = useState<File>();

  useEffect(() => {
    setSelectedFile(undefined);
  }, [show]);

  const inspectFile = () => {
    if (!selectedFile) {
      return <></>;
    }

    const name = selectedFile.name;
    // File size (convert bytes → MB, round to 2 decimals)
    const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
    const type = selectedFile.type || 'unknown';
    const ext = name.includes('.')
      ? name?.split('.')?.pop()?.toLowerCase()
      : '';

    return (
      <div>
        <div>
          <strong>Filename:</strong> {name}
        </div>
        <div>
          <strong>Size:</strong> {sizeMB} MB
        </div>
        <div>
          <strong>Content Type:</strong> {type}
        </div>
        <div>
          <strong>Extension:</strong> {ext}
        </div>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        {validationError ? <AppAlert message={validationError} /> : <></>}
        {action === 'upload' ? (
          <div>
            <small style={{ float: 'left', marginBottom: '8px' }}>
              Supported file types: .pdf, .png, .jpg, .jpeg, .webp
            </small>
            <FileUpload
              accept="application/pdf,.pdf,image/*,.png,.jpg,.jpeg,.webp"
              label=""
              handleChooseFile={(file: File) => setSelectedFile(file)}
            />
            <div style={{ marginTop: '8px' }}></div>
            {inspectFile()}
          </div>
        ) : (
          <p>Are you sure you want to delete this attachment?</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {action === 'upload' ? (
          <Button
            variant="success"
            onClick={() => onCreate(selectedFile)}
            disabled={loading || !selectedFile}
          >
            Create
          </Button>
        ) : (
          <Button variant="danger" onClick={onDelete} disabled={loading}>
            Delete
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AttachmentModal;
