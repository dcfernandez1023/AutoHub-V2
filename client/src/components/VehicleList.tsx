import React from 'react';

import { ListGroup, Spinner, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useVehicles from '../hooks/useVehicles';

interface VehicleListProps {
  shared: boolean;
}

const VehicleList: React.FC<VehicleListProps> = (props: VehicleListProps) => {
  const { shared } = props;

  const navigate = useNavigate();
  const { loading, vehicles, sharedVehicles } = useVehicles({ shared });

  if (loading) {
    return (
      <div className="centered-div">
        <Spinner animation="border" />
      </div>
    );
  }

  const handleListGroupClick = (id: string) => {
    navigate(`/vehicles/${id}`);
  };

  const vehiclesToUse = shared ? sharedVehicles : vehicles;

  if (!vehiclesToUse?.length) {
    return <div>No vehicles</div>;
  }

  return (
    <ListGroup>
      {vehiclesToUse.map((vehicle) => {
        return (
          <ListGroup.Item
            key={vehicle.id}
            className="d-flex align-items-center"
            action
            onClick={() => {
              handleListGroupClick(vehicle.id);
            }}
          >
            <Image
              src={vehicle.base64Image ?? ''}
              roundedCircle
              width={40}
              height={40}
              className="me-3"
              alt={`${vehicle.name} image`}
            />
            <span>{vehicle.name}</span>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default VehicleList;
