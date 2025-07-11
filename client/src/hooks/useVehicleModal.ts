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

  const handleImageUpload = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Result = reader.result as string;
        if (base64Result) {
          const vehicleSnapshot = Object.assign({}, vehicle);
          vehicleSnapshot.base64Image = base64Result;
          setVehicle(vehicleSnapshot);
          resolve(base64Result);
        } else {
          reject(new Error('Failed to read image'));
        }
      };
      reader.onerror = (error) => reject(error);
      // Start reading
      reader.readAsDataURL(file);
    });
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
    handleImageUpload,
  };
};

export default useVehicleModal;
