import { useCallback, useEffect, useState } from 'react';
import { ScheduledServiceType } from '../types/scheduledService';
import ScheduledServiceClient from '../api/ScheduledServiceClient';
import { useAuthContext } from '../context/AuthContext';

type UseScheduledServiceTypeProps = {
  sharedVehicleId?: string;
};

export const useScheduledServiceTypes = (
  props?: UseScheduledServiceTypeProps
) => {
  const { sharedVehicleId } = props ?? {};

  const [scheduledServiceTypes, setScheduledServiceTypes] = useState<
    ScheduledServiceType[]
  >([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);

  const { authContext } = useAuthContext();

  const getScheduledServiceTypes = useCallback(async () => {
    try {
      if (!authContext) {
        throw new Error('No auth context');
      }

      setLoading(true);
      const data: ScheduledServiceType[] =
        await ScheduledServiceClient.getScheduledServiceTypes(
          authContext.userId,
          sharedVehicleId
        );
      setScheduledServiceTypes(data);
    } catch (error) {
      console.error('Failed to fetch scheduled service types', error);
      setError('Failed to fetch scheduled service types');
    } finally {
      setLoading(false);
    }
  }, [sharedVehicleId]);

  const createOrUpdateScheduledServiceType = async (
    name: string,
    scheduledServiceTypeId?: string,
    callback?: (scheduledServiceType: ScheduledServiceType) => void
  ) => {
    try {
      if (!authContext) {
        throw new Error('No auth context');
      }

      if (!scheduledServiceTypes) {
        throw new Error('No scheduled service types have been fetched');
      }

      if (!name) {
        setError('Name is required');
        return;
      }

      setLoadingAction(true);
      const action = Boolean(scheduledServiceTypeId) ? 'UPDATE' : 'CREATE';
      const data: ScheduledServiceType =
        await ScheduledServiceClient.createOrUpdateScheduledServiceType(
          authContext.userId,
          name,
          action,
          scheduledServiceTypeId
        );

      const copy = scheduledServiceTypes.slice();
      if (action === 'CREATE') {
        copy.push(data);
      } else {
        const index = copy?.findIndex((sst) => sst.id === data.id);
        if (index !== -1) {
          copy[index] = data;
        }
      }
      setScheduledServiceTypes(copy);

      if (callback) {
        callback(data);
      }
    } catch (error) {
      setError('Failed to create or update scheduled service type');
    } finally {
      setLoadingAction(false);
    }
  };

  const deleteScheduledServiceType = async (
    scheduledServiceTypeId: string,
    callback?: (scheduledServiceTypeId: string) => void
  ) => {
    try {
      if (!authContext) {
        throw new Error('No auth context');
      }

      if (!scheduledServiceTypes) {
        throw new Error('No scheduled service types have been fetched');
      }

      if (!scheduledServiceTypeId) {
        throw new Error('No scheduled service type id provided');
      }

      setLoadingAction(true);
      const data: ScheduledServiceType =
        await ScheduledServiceClient.deleteScheduledServiceType(
          authContext.userId,
          scheduledServiceTypeId
        );
      const copy = scheduledServiceTypes
        .slice()
        .filter((sst) => sst.id !== scheduledServiceTypeId);
      setScheduledServiceTypes(copy);

      if (callback) {
        callback(data.id);
      }
    } catch (error) {
      setError('Failed to delete scheduled service type');
    } finally {
      setLoadingAction(false);
    }
  };

  useEffect(() => {
    void getScheduledServiceTypes();
  }, [getScheduledServiceTypes]);

  return {
    scheduledServiceTypes,
    setScheduledServiceTypes,
    error,
    setError,
    loading,
    setLoading,
    loadingAction,
    setLoadingAction,
    createOrUpdateScheduledServiceType,
    deleteScheduledServiceType,
  };
};
