import { useState } from 'react';
import { Navbar, Container, Nav, Offcanvas } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import useAppNavbar from '../hooks/useAppNavbar';

const AppNavbar: React.FC = () => {
  const { authContext, handleLogout } = useAppNavbar();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Navbar bg="light" expand={false} className="app-navbar-padding">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/">
          AutoHub V2 (Beta)
        </Navbar.Brand>

        {Boolean(authContext) && (
          <>
            {/* Right-aligned hamburger */}
            <Navbar.Toggle
              aria-controls="app-offcanvas"
              className="ms-auto"
              onClick={handleShow}
            />

            {/* Offcanvas controlled by state */}
            <Navbar.Offcanvas
              id="app-offcanvas"
              aria-labelledby="app-offcanvas-label"
              placement="end"
              show={show}
              onHide={handleClose}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="app-offcanvas-label">Menu</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="flex-grow-1">
                  <Nav.Link as={NavLink} to="/" end onClick={handleClose}>
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/changelog"
                    end
                    onClick={handleClose}
                  >
                    Changelog
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/data" end onClick={handleClose}>
                    Import/Export
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/scheduledServiceTypes"
                    end
                    onClick={handleClose}
                  >
                    Scheduled Service Types
                  </Nav.Link>
                  <div className="border-top my-2" />
                  <Nav.Link
                    href="https://auto-hub-car-management.web.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AutoHub V1
                  </Nav.Link>
                  <Nav.Link
                    href="https://github.com/dcfernandez1023/AutoHub-V2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AutoHub V2 Github
                  </Nav.Link>
                  <div className="border-top my-2" />
                  <Nav.Link
                    onClick={() => {
                      handleLogout();
                      handleClose();
                    }}
                  >
                    Logout
                  </Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
