import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthContextData, AuthContextType } from '../types/auth';
import AuthClient from '../api/AuthClient';

const defaultContext: AuthContextData = {
  authContext: undefined,
  setAuthContext: () => {},
  loading: false,
};

const AuthContext = createContext(defaultContext);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authContext, setAuthContext] = useState<AuthContextType | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authContextData = await AuthClient.me();
        if (!authContextData) {
          throw new Error('No auth context returned');
        } else {
          setAuthContext(authContextData);
        }
      } catch (err) {
        console.error('Auth check failed', err);
        setAuthContext(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authContext, setAuthContext, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
