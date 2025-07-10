
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Navigate } from 'react-router-dom';

interface UserProtectedRouteProps {
  children: React.ReactNode;
}

export const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useUserAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
