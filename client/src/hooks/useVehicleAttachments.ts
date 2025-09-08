import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useCommunicationContext } from '../context/CommunicationContext';
import VehicleAttachmentClient from '../api/VehicleAttachmentClient';
import { VehicleAttachment, VehicleAttachmentRaw } from '../types/vehicle';

type UseVehicleAttachmentsProps = {
  vehicleId: string;
};

const useVehicleAttachments = (props: UseVehicleAttachmentsProps) => {
  const { vehicleId } = props;

  const [loadingAttachments, setLoadingAttachments] = useState<boolean>(false);
  const [vehicleAttachments, setVehicleAttachments] = useState<
    VehicleAttachment[]
  >([]);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string>();

  const { authContext } = useAuthContext();
  const { setCommunicationContext } = useCommunicationContext();

  const getVehicleAttachments = useCallback(async () => {
    try {
      if (!authContext) {
        throw new Error('Auth context not provided');
      }

      if (!vehicleId) {
        throw new Error('No vehicle id provided');
      }

      setLoadingAttachments(true);
      const attachments: VehicleAttachmentRaw[] =
        await VehicleAttachmentClient.getAttachments(
          authContext.userId,
          vehicleId
        );
      // Transform dateCreated from string to Date obj
      setVehicleAttachments(
        attachments.map((attachment) => ({
          ...attachment,
          dateCreated: new Date(attachment.dateCreated),
        }))
      );
    } catch (error) {
      setCommunicationContext({
        message: 'Failed to fetch vehicle attachments',
        kind: 'error',
      });
    } finally {
      setLoadingAttachments(false);
    }
  }, [vehicleId]);

  const createVehicleAttachment = useCallback(
    async (file: File | undefined, callback: () => void) => {
      try {
        if (!authContext) {
          throw new Error('Auth context not provided');
        }

        if (!vehicleId) {
          throw new Error('No vehicle id provided');
        }

        if (!file) {
          throw new Error('No file provided');
        }

        setActionLoading(true);

        const attachment: VehicleAttachmentRaw =
          await VehicleAttachmentClient.createAttachment(
            authContext.userId,
            vehicleId,
            file
          );

        const createdAttachment: VehicleAttachment = {
          ...attachment,
          dateCreated: new Date(attachment.dateCreated),
        };

        const mutableVehicleAttachments = vehicleAttachments.slice();
        mutableVehicleAttachments.push(createdAttachment);

        setVehicleAttachments(
          mutableVehicleAttachments.sort(
            (a, b) => b.dateCreated.getTime() - a.dateCreated.getTime()
          )
        );

        callback();
      } catch (error) {
        setActionError('Failed to create attachment');
      } finally {
        setActionLoading(false);
      }
    },
    [vehicleId, vehicleAttachments]
  );

  const deleteVehicleAttachment = useCallback(
    async (attachmentId: string | undefined, callback: () => void) => {
      try {
        if (!authContext) {
          throw new Error('Auth context not provided');
        }

        if (!vehicleId) {
          throw new Error('No vehicle id provided');
        }

        if (!attachmentId) {
          throw new Error('No attachment id provided');
        }

        setActionLoading(true);

        const attachment: VehicleAttachmentRaw =
          await VehicleAttachmentClient.deleteAttachment(
            authContext.userId,
            vehicleId,
            attachmentId
          );

        const deletedAttachment: VehicleAttachment = {
          ...attachment,
          dateCreated: new Date(attachment.dateCreated),
        };

        const mutableVehicleAttachments = vehicleAttachments.slice();
        mutableVehicleAttachments.push(deletedAttachment);

        setVehicleAttachments(
          mutableVehicleAttachments
            .filter((attachment) => attachment.id !== deletedAttachment.id)
            .sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime())
        );

        callback();
      } catch (error) {
        setActionError('Failed to delete attachment');
      } finally {
        setActionLoading(false);
      }
    },
    [vehicleId, vehicleAttachments]
  );

  const downloadAttachment = useCallback(
    async (attachmentId: string) => {
      try {
        if (!authContext) {
          throw new Error('Auth context not provided');
        }

        if (!vehicleId) {
          throw new Error('No vehicle id provided');
        }

        if (!attachmentId) {
          throw new Error('No attachment id provided');
        }

        setActionLoading(true);

        await VehicleAttachmentClient.download(
          authContext.userId,
          vehicleId,
          attachmentId
        );
      } catch (error) {
        setCommunicationContext({
          kind: 'error',
          message: 'Failed to download attachment. Please try again',
        });
        console.error(error);
      } finally {
        setActionLoading(false);
      }
    },
    [vehicleId]
  );

  useEffect(() => {
    void getVehicleAttachments();
  }, [getVehicleAttachments]);

  return {
    vehicleAttachments,
    loadingAttachments,
    actionLoading,
    actionError,
    setActionError,
    createVehicleAttachment,
    deleteVehicleAttachment,
    downloadAttachment,
  };
};

export default useVehicleAttachments;
