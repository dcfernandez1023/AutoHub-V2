import React from 'react';

interface AppAlertProps {
  message: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

const AppAlert: React.FC<AppAlertProps> = ({ message, type = 'danger' }) => {
  return <div className={`app-alert alert-${type}`}>{message}</div>;
};

export default AppAlert;
