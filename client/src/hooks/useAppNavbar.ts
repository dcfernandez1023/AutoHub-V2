import { useAuthContext } from '../context/AuthContext';
import UserClient from '../api/UserClient';

const useAppNavbar = () => {
  const { authContext, setAuthContext, loading } = useAuthContext();

  const handleLogout = async () => {
    try {
      if (!loading) {
        await UserClient.logout();
        setAuthContext(undefined);

        if (window.location.origin.includes('localhost')) {
          window.location.href = '/';
        } else {
          window.location.href = '/autohub';
        }
      }
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return {
    authContext,
    handleLogout,
  };
};

export default useAppNavbar;
