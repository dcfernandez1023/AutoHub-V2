import { useEffect, useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { useAuthContext } from '../context/AuthContext';

type UseVehicleOwnerProps = {
  vehicle: Vehicle | undefined;
};

const useVehicleOwner = (props: UseVehicleOwnerProps) => {
  const { vehicle } = props;

  const [isOwner, setIsOwner] = useState<boolean>(true);

  const { authContext } = useAuthContext();

  useEffect(() => {
    if (!vehicle || !authContext) {
      setIsOwner(false);
    } else {
      setIsOwner(vehicle.userId === authContext.userId);
    }
  }, [vehicle?.id, authContext]);

  return {
    isOwner,
  };
};

export default useVehicleOwner;
