import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import VehicleList from './VehicleList';
import { Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';
import Vehicle from './Vehicle';
import Vehicles from './Vehicles';
import ScheduledServiceTypes from './ScheduledServiceTypes';

const Home: React.FC = () => {
  return (
    <Container>
      <Row className="div-spacing">
        <Col>
          <Routes>
            <Route path="/" element={<Vehicles />} />
            <Route
              path="/scheduledServiceTypes"
              element={<ScheduledServiceTypes />}
            />
            <Route path="/vehicles/:vehicleId" element={<Vehicle />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
