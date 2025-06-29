import { useEffect, useState } from 'react';
import { CreateOrUpdateVehicle, Vehicle } from '../types/vehicle';

interface UseVehicleModalProps {
  existingVehicle?: CreateOrUpdateVehicle;
}

const useVehicleModal = (props: UseVehicleModalProps) => {
  const [vehicle, setVehicle] = useState<CreateOrUpdateVehicle>();

  const handleChange = (
    e: any,
    propertyType: 'string' | 'number',
    property: keyof CreateOrUpdateVehicle
  ) => {
    const vehicleSnapshot = Object.assign({}, vehicle);
    if (propertyType === 'string') {
      // @ts-ignore TODO: Fix this
      vehicleSnapshot[property] = e.target.value.toString();
    } else if (propertyType === 'number') {
      if (e.target.value.trim().length === 0) {
        // @ts-ignore TODO: Fix this
        vehicleSnapshot[property] = 0;
      } else {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
          // @ts-ignore TODO: Fix this
          vehicleSnapshot[property] = value;
        }
      }
    }
    setVehicle(vehicleSnapshot);
  };

  useEffect(() => {
    if (props.existingVehicle) {
      setVehicle(props.existingVehicle);
    } else {
      // @ts-ignore TODO: Fix this
      setVehicle({
        name: '',
        mileage: 0,
        year: 0,
        make: '',
        model: '',
        licensePlate: '',
        vin: '',
        notes: '',
        dateCreated: 0,
        base64Image: '',
      });
    }
  }, [props.existingVehicle]);

  return {
    vehicle,
    setVehicle,
    handleChange,
  };
};

export default useVehicleModal;
