import { useCallback, useEffect, useState } from 'react';
import {
  CreateScheduledServiceInstanceRequest,
  ScheduledServiceInstance,
} from '../types/scheduledService';
import ScheduledServiceClient from '../api/ScheduledServiceClient';
import { useAuthContext } from '../context/AuthContext';

type UseScheduledServiceInstancesProps = {
  vehicleId: string;
};

export const useScheduledServiceInstances = (
  props: UseScheduledServiceInstancesProps
) => {
  const { vehicleId } = props;

  const [scheduledServiceInstances, setScheduledServiceInstances] = useState<
    ScheduledServiceInstance[]
  >([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const { authContext } = useAuthContext();

  const getScheduledServiceInstances = async (vehicleId: string) => {
    try {
      if (!authContext) {
        throw new Error('No auth context');
      }

      setLoading(true);
      const data: ScheduledServiceInstance[] =
        await ScheduledServiceClient.getScheduledServiceInstances(
          authContext.userId,
          vehicleId
        );

      setScheduledServiceInstances(data);
    } catch (error) {
      console.error('Failed to fetch scheduled service types', error);
      setError('Failed to fetch scheduled service types');
    } finally {
      setLoading(false);
    }
  };

  const createScheduledServiceInstances = useCallback(
    async (
      vehicleId: string,
      records: CreateScheduledServiceInstanceRequest[],
      callback: () => void
    ) => {
      try {
        if (!authContext) {
          throw new Error('No auth context');
        }

        setActionLoading(true);
        const createdScheduledServiceInstances =
          await ScheduledServiceClient.createScheduledServiceInstances(
            authContext.userId,
            vehicleId,
            records
          );

        const mutableScheduledServiceInstances =
          scheduledServiceInstances?.slice();
        if (mutableScheduledServiceInstances) {
          mutableScheduledServiceInstances.push(
            ...createdScheduledServiceInstances
          );
          setScheduledServiceInstances(mutableScheduledServiceInstances);
        }

        callback();
      } catch (error) {
        console.error('Failed to create scheduled service instances', error);
        setError('Failed to create scheduled service instances');
      } finally {
        setActionLoading(false);
      }
    },
    [scheduledServiceInstances, authContext]
  );

  const updateScheduledServiceInstance = useCallback(
    async (
      vehicleId: string,
      scheduledServiceInstance: ScheduledServiceInstance,
      callback: () => void
    ) => {
      try {
        if (!authContext) {
          throw new Error('No auth context');
        }

        setActionLoading(true);
        const updatedScheduledServiceInstance =
          await ScheduledServiceClient.updateScheduledServiceInstance(
            authContext.userId,
            vehicleId,
            scheduledServiceInstance
          );

        const mutableScheduledServiceInstances =
          scheduledServiceInstances?.slice();
        if (mutableScheduledServiceInstances) {
          const index = mutableScheduledServiceInstances.findIndex(
            (ssi) => ssi.id === updatedScheduledServiceInstance.id
          );
          mutableScheduledServiceInstances[index] =
            updatedScheduledServiceInstance;
          setScheduledServiceInstances(mutableScheduledServiceInstances);
        }

        callback();
      } catch (error) {
        console.error('Failed to update scheduled service instance', error);
        setError('Failed to update scheduled service instance');
      } finally {
        setActionLoading(false);
      }
    },
    [scheduledServiceInstances, authContext]
  );

  const deleteScheduledServiceInstance = useCallback(
    async (
      vehicleId: string,
      scheduledServiceInstanceId: string,
      callback: () => void
    ) => {
      try {
        if (!authContext) {
          throw new Error('No auth context');
        }

        setActionLoading(true);
        const deletedScheduledServiceInstance =
          await ScheduledServiceClient.deleteScheduledServiceInstance(
            authContext.userId,
            vehicleId,
            scheduledServiceInstanceId
          );
        const mutableScheduledServiceInstances =
          scheduledServiceInstances?.slice();
        if (mutableScheduledServiceInstances) {
          setScheduledServiceInstances(
            mutableScheduledServiceInstances.filter(
              (ssi) => ssi.id !== scheduledServiceInstanceId
            )
          );
        }
        callback();
      } catch (error) {
        setError('Failed to delete scheduled service instance');
      } finally {
        setActionLoading(false);
      }
    },
    [scheduledServiceInstances, authContext]
  );

  useEffect(() => {
    void getScheduledServiceInstances(vehicleId);
  }, [vehicleId]);

  return {
    error,
    setError,
    loading,
    actionLoading,
    setLoading,
    setActionLoading,
    scheduledServiceInstances,
    setScheduledServiceInstances,
    createScheduledServiceInstances,
    updateScheduledServiceInstance,
    deleteScheduledServiceInstance,
  };
};
