import { Row, Col, ButtonGroup, ToggleButton, Button } from 'react-bootstrap';
import VehicleList from './VehicleList';
import { useState } from 'react';
import VehicleModal from './VehicleModal';

const Vehicles: React.FC = () => {
  const [shared, setShared] = useState<boolean>(false);
  const [creatingVehicle, setCreatingVehicle] = useState<boolean>(false);

  return (
    <div>
      <Row className="div-spacing-bottom">
        <Col xs={6} className="align-left">
          <ButtonGroup>
            <ToggleButton
              id="vehicles-owned"
              variant="light"
              type="radio"
              value="owned"
              checked={!shared}
              onChange={() => setShared(false)}
            >
              Owned by me
            </ToggleButton>
            <ToggleButton
              id="vehicles-shared"
              variant="light"
              type="radio"
              value="shared"
              checked={shared}
              onChange={() => setShared(true)}
            >
              Shared
            </ToggleButton>
          </ButtonGroup>
        </Col>
        <Col xs={6} className="align-right">
          <Button onClick={() => setCreatingVehicle(true)}>
            Create Vehicle
          </Button>
        </Col>
      </Row>
      <VehicleList shared={shared} />
      <VehicleModal
        show={creatingVehicle}
        onClose={() => setCreatingVehicle(false)}
      />
    </div>
  );
};

export default Vehicles;
