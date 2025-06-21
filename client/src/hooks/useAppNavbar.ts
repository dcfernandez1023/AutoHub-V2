import { useAuthContext } from '../context/AuthContext';
import UserClient from '../api/UserClient';

const useAppNavbar = () => {
  const { authContext, setAuthContext, loading } = useAuthContext();

  const handleLogout = async () => {
    try {
      if (!loading) {
        await UserClient.logout();
        setAuthContext(undefined);
        window.location.href = '/';
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
