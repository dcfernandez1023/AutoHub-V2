import { useState } from 'react';

import UserClient from '../api/UserClient';
import { useAuthContext } from '../context/AuthContext';

const useLogin = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [validationError, setValidationError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [registrationInProgress, setRegistrationInProgress] =
    useState<boolean>(false);

  const { setAuthContext } = useAuthContext();

  const switchMode = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setValidationError(undefined);
    setRegistrationInProgress(false);

    if (mode === 'login') {
      setMode('register');
    } else {
      setMode('login');
    }
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setValidationError('Please provide an email and password');
        return;
      }

      setLoading(true);
      const authContextData = await UserClient.login(email, password);

      if (authContextData) {
        setAuthContext(authContextData);
      } else {
        setValidationError('Login failed, please try again');
      }
    } catch (error) {
      console.error('Failed to login', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      if (!email || !username || !password) {
        setValidationError('Please provide an email, username, and password');
        return;
      }

      setLoading(true);
      const registeredEmail = await UserClient.register(
        email,
        username,
        password
      );

      if (registeredEmail) {
        setRegistrationInProgress(true);
      } else {
        setValidationError('Registration failed. Please try again');
      }
    } catch (error) {
      console.error('Failed to login', error);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};

export default useLogin;
