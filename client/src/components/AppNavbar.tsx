import { Nav, Navbar } from 'react-bootstrap';
import useAppNavbar from '../hooks/useAppNavbar';

const AppNavbar: React.FC = () => {
  const { authContext, handleLogout } = useAppNavbar();

  return (
    <Navbar bg="light" className="app-navbar-padding">
      <Navbar.Brand href="/">AutoHub V2</Navbar.Brand>
      <Navbar.Toggle />
      {Boolean(authContext) ? (
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link onClick={() => void handleLogout()}>Logout</Nav.Link>
        </Navbar.Collapse>
      ) : (
        <></>
      )}
    </Navbar>
  );
};

export default AppNavbar;
