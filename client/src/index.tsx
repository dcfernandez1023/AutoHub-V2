import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';
import { BrowserRouter } from 'react-router-dom';
import { CommunicationProvider } from './context/CommunicationContext';
import CommunicationToast from './components/CommunicationToast';

const basename = window.location.hostname.includes('localhost')
  ? '/'
  : '/autohub';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter basename={basename}>
    <AuthProvider>
      <CommunicationProvider>
        <App />
        <CommunicationToast />
      </CommunicationProvider>
    </AuthProvider>
  </BrowserRouter>
);
