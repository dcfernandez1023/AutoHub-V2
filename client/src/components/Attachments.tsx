import { Button, Spinner, Table } from 'react-bootstrap';
import useVehicleAttachments from '../hooks/useVehicleAttachments';
import { useState } from 'react';
import AttachmentModal, { AttachmentAction } from './AttachmentModal';
import { VehicleAttachment } from '../types/vehicle';

type AttachmentsProps = { vehicleId: string };

const Attachments: React.FC<AttachmentsProps> = ({ vehicleId }) => {
  const [modalAction, setModalAction] = useState<AttachmentAction>();
  const [selectedAttachment, setSelectedAttachment] =
    useState<VehicleAttachment>();

  const {
    vehicleAttachments,
    loadingAttachments,
    actionLoading,
    actionError,
    setActionError,
    createVehicleAttachment,
    deleteVehicleAttachment,
    downloadAttachment,
  } = useVehicleAttachments({
    vehicleId,
  });

  const openUploadModal = () => setModalAction('upload');
  const openDeleteModal = () => setModalAction('delete');

  if (loadingAttachments) {
    return (
      <div className="centered-div">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <div>
        <Button
          style={{ float: 'right' }}
          variant="success"
          disabled={actionLoading}
          onClick={openUploadModal}
        >
          Create Attachment
        </Button>
      </div>

      {vehicleAttachments.length === 0 ? (
        <div className="centered-div" style={{ fontSize: '20px' }}>
          No attachments
        </div>
      ) : (
        <Table responsive className="fixed-table">
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '40%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Date Created</th>
              <th>Attachment</th>
              <th>Content Type</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicleAttachments.map((attachment) => (
              <tr key={attachment.id}>
                <td>
                  {`${attachment.dateCreated.toLocaleDateString()} ${attachment.dateCreated.toLocaleTimeString()}`}
                </td>
                <td>{attachment.filename}</td>
                <td>{attachment.contentType}</td>
                <td>{attachment.size} MB</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="dark"
                      disabled={actionLoading}
                      onClick={() => {
                        void downloadAttachment(attachment.id);
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={actionLoading}
                      onClick={() => {
                        setSelectedAttachment(attachment);
                        openDeleteModal();
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <AttachmentModal
        title={
          modalAction === 'upload'
            ? 'Create Attachment'
            : modalAction === 'delete'
              ? 'Delete Attachment'
              : ''
        }
        action={modalAction}
        show={
          modalAction === 'upload' ||
          (modalAction === 'delete' && Boolean(selectedAttachment))
        }
        loading={actionLoading}
        onClose={() => {
          setModalAction(undefined);
          setActionError(undefined);
        }}
        onCreate={(file: File | undefined) => {
          void createVehicleAttachment(file, () => {
            setModalAction(undefined);
            setActionError(undefined);
          });
        }}
        onDelete={() => {
          void deleteVehicleAttachment(selectedAttachment?.id, () => {
            setModalAction(undefined);
            setActionError(undefined);
            setSelectedAttachment(undefined);
          });
        }}
        validationError={actionError}
      />
    </div>
  );
};

export default Attachments;
