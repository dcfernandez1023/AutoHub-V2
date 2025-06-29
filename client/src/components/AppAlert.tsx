import React, { JSX } from 'react';

interface AppAlertProps {
  message: string | JSX.Element;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

const AppAlert: React.FC<AppAlertProps> = ({ message, type = 'danger' }) => {
  return <div className={`app-alert alert-${type}`}>{message}</div>;
};

export default AppAlert;
