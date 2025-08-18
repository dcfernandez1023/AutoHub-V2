import { Toast } from 'react-bootstrap';
import { useCommunicationContext } from '../context/CommunicationContext';

import {
  XCircleFill,
  ExclamationTriangleFill,
  InfoCircleFill,
} from 'react-bootstrap-icons';

const CommunicationToast: React.FC = () => {
  const { communicationContext, setCommunicationContext } =
    useCommunicationContext();

  if (!communicationContext) {
    return <></>;
  }

  const { kind, message, code } = communicationContext;

  const title =
    kind === 'error' ? 'Error' : kind === 'warning' ? 'Warning' : 'Info';

  const icon =
    kind === 'error' ? (
      <XCircleFill size={16} className="me-2 flex-shrink-0" />
    ) : kind === 'warning' ? (
      <ExclamationTriangleFill size={16} className="me-2 flex-shrink-0" />
    ) : (
      <InfoCircleFill size={16} className="me-2 flex-shrink-0" />
    );

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        zIndex: 9999,
      }}
    >
      <Toast onClose={() => setCommunicationContext(undefined)}>
        <Toast.Header>
          <strong className="me-auto d-flex align-items-center">
            {icon}
            {title}
          </strong>
        </Toast.Header>

        <Toast.Body>
          {message}
          {code && kind === 'error' && (
            <div>
              <small>Error code: {code}</small>
            </div>
          )}
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default CommunicationToast;
