import { useCallback, useEffect, useState } from 'react';
import { ScheduledLogUsage, VehicleCosts } from '../types/analytics';
import { useAuthContext } from '../context/AuthContext';
import { useCommunicationContext } from '../context/CommunicationContext';
import AnalyticsClient from '../api/AnalyticsClient';

type UseAnalyticsProps = {
  vehicleId: string;
};

const useAnalytics = (props: UseAnalyticsProps) => {
  const { vehicleId } = props;

  const [loadingCost, setLoadingCost] = useState<boolean>(false);
  const [loadingScheduledLogUsage, setLoadingScheduledLogUsage] =
    useState<boolean>(false);
  const [vehicleCosts, setVehicleCosts] = useState<VehicleCosts>();
  const [scheduledLogUsage, setScheduledLogUsage] = useState<
    ScheduledLogUsage[]
  >([]);

  const { authContext } = useAuthContext();
  const { setCommunicationContext } = useCommunicationContext();

  const getCosts = useCallback(async () => {
    try {
      if (!authContext || !authContext.userId) {
        throw new Error('No auth context');
      }

      if (!vehicleId) {
        throw new Error('No vehicle id provided');
      }

      setLoadingCost(true);

      const userId = authContext.userId;
      const costs = await AnalyticsClient.getVehicleCost(userId, vehicleId);
      setVehicleCosts(costs);
    } catch (error) {
      setCommunicationContext({
        kind: 'error',
        message: 'Failed to fetch vehicle analytics data',
      });
    } finally {
      setLoadingCost(false);
    }
  }, [vehicleId]);

  const getScheduledLogUsage = useCallback(async () => {
    try {
      if (!authContext || !authContext.userId) {
        throw new Error('No auth context');
      }

      if (!vehicleId) {
        throw new Error('No vehicle id provided');
      }

      setLoadingScheduledLogUsage(true);

      const userId = authContext.userId;
      const usage = await AnalyticsClient.getScheduledLogUsage(
        userId,
        vehicleId
      );
      setScheduledLogUsage(usage);
    } catch (error) {
      setCommunicationContext({
        kind: 'error',
        message: 'Failed to fetch vehicle analytics data',
      });
    } finally {
      setLoadingScheduledLogUsage(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    getCosts();
    getScheduledLogUsage();
  }, [getCosts, getScheduledLogUsage]);

  return {
    loadingCost,
    loadingScheduledLogUsage,
    vehicleCosts,
    scheduledLogUsage,
  };
};

export default useAnalytics;
