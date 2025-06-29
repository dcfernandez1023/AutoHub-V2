import React from 'react';
import { useAuthContext } from './context/AuthContext';
import { Spinner } from 'react-bootstrap';
import Login from './components/Login';
import Home from './components/Home';
import AppNavbar from './components/AppNavbar';

function App() {
  const { authContext, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="centered-div">
        <Spinner animation="border" />
      </div>
    );
  }

  const AppContent = () => {
    return (
      <>
        <AppNavbar />
        {authContext ? <Home /> : <Login />}
      </>
    );
  };

  return <AppContent />;
}

export default App;
