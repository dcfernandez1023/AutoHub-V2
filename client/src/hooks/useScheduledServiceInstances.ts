import { useEffect, useState } from 'react';
import { ScheduledServiceInstance } from '../types/scheduledService';
import ScheduledServiceClient from '../api/ScheduledServiceClient';
import { useAuthContext } from '../context/AuthContext';

type UseScheduledServiceInstancesProps = {
  vehicleId: string;
};

export const useScheduledServiceInstances = (
  props: UseScheduledServiceInstancesProps
) => {
  const { vehicleId } = props;

  const [scheduledServiceInstances, setScheduledServiceInstances] =
    useState<ScheduledServiceInstance[]>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

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

      setScheduledServiceInstances([
        {
          id: 'ssi0',
          userId: 'user',
          vehicleId: 'vehicle',
          scheduledServiceTypeId: '0',
          mileInterval: 5000,
          timeInterval: 6,
          timeUnits: 'MONTH',
        },
      ]);
      //   setScheduledServiceInstances(data);
    } catch (error) {
      console.error('Failed to fetch scheduled service types', error);
      setError('Failed to fetch scheduled service types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void getScheduledServiceInstances(vehicleId);
  }, [vehicleId]);

  return {
    error,
    setError,
    loading,
    setLoading,
    scheduledServiceInstances,
    setScheduledServiceInstances,
  };
};
