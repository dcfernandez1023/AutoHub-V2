import React from 'react';

import { FormLabel, FormControl, Button, Alert } from 'react-bootstrap';
import useLogin from '../hooks/useLogin';
import AppAlert from './AppAlert';

const Login: React.FC = () => {
  const {
    mode,
    email,
    password,
    username,
    validationError,
    loading,
    registrationInProgress,
    setMode,
    setEmail,
    setPassword,
    setUsername,
    setValidationError,
    switchMode,
    handleLogin,
    handleRegister,
  } = useLogin();

  const LoginButton = () => {
    return (
      <Button
        className="login-button"
        variant="success"
        disabled={loading}
        onClick={() => {
          if (mode === 'login') {
            void handleLogin();
          } else {
            void handleRegister();
          }
        }}
      >
        {mode === 'login' ? 'Login' : 'Register'}
      </Button>
    );
  };

  const ModeLink = () => {
    return (
      <Button
        variant="link"
        size="sm"
        disabled={loading}
        onClick={() => switchMode()}
      >
        {mode === 'login'
          ? 'No account? Click to register'
          : 'Have an account? Click to login'}
      </Button>
    );
  };

  const ValidationError = () => {
    if (validationError) {
      return <AppAlert type="danger" message={validationError} />;
    }

    return <></>;
  };

  if (registrationInProgress) {
    return (
      <div className="centered-div">
        📧 An email was sent to {email} to complete registration.
      </div>
    );
  }

  return (
    <div className="centered-div">
      <div className="input-margin">
        <ValidationError />
      </div>
      <div className="input-margin">
        <FormLabel htmlFor="login-email">Email</FormLabel>
        <FormControl
          id="login-email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <>
        {mode === 'register' ? (
          <div className="input-margin">
            <FormLabel htmlFor="register-username">Username</FormLabel>
            <FormControl
              id="register-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        ) : (
          <></>
        )}
      </>
      <div className="input-margin">
        <FormLabel htmlFor="login-pwd">Password</FormLabel>
        <FormControl
          id="login-pwd"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div className="button-link">
          <ModeLink />
        </div>
      </div>
      <div className="login-actions">
        <LoginButton />
      </div>
    </div>
  );
};

export default Login;
