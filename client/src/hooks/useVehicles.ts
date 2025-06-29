import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Vehicle } from '../types/vehicle';
import VehicleClient from '../api/VehicleClient';

interface UseVehiclesProps {
  vehicleId?: string;
  shared?: boolean;
}

const useVehicles = (props?: UseVehiclesProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>();
  const [sharedVehicles, setSharedVehicles] = useState<Vehicle[]>();
  const [vehicle, setVehicle] = useState<Vehicle>();
  const [loading, setLoading] = useState<boolean>(false);

  const { vehicleId, shared } = props ?? {};

  const { authContext } = useAuthContext();

  const getVehicles = useCallback(async () => {
    try {
      if (!authContext) {
        throw new Error('No auth context');
      }

      if (shared && sharedVehicles) {
        return;
      }

      if (!shared && vehicles) {
        return;
      }

      setLoading(true);
      const fetchedVehicles = await VehicleClient.getVehicles(
        authContext.userId,
        Boolean(shared)
      );

      if (!fetchedVehicles) {
        throw new Error('No vehicles retrieved');
      }

      if (shared) {
        setSharedVehicles(fetchedVehicles);
      } else {
        setVehicles(fetchedVehicles);
      }
    } catch (error) {
      console.error('Failed to get vehicles', error);
    } finally {
      setLoading(false);
    }
  }, [authContext, shared]);

  const getVehicle = useCallback(
    async (vehicleId: string) => {
      try {
        if (!authContext) {
          throw new Error('No auth context');
        }

        if (!vehicleId) {
          throw new Error('No vehicle id provided');
        }

        setLoading(true);
        const vehicle = await VehicleClient.getVehicle(
          authContext.userId,
          vehicleId
        );

        if (!vehicle) {
          throw new Error('No vehice retrieved');
        }

        setVehicle(vehicle);
      } catch (error) {
        console.error('Failed to get vehicles', error);
      } finally {
        setLoading(false);
      }
    },
    [authContext, shared, vehicleId]
  );

  useEffect(() => {
    if (vehicleId) {
      void getVehicle(vehicleId);
    } else {
      void getVehicles();
    }
  }, [getVehicles]);

  return {
    loading,
    vehicle,
    vehicles,
    sharedVehicles,
    setVehicles,
    setVehicle,
  };
};

export default useVehicles;
