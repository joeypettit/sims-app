import { Navigate, useLocation } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const userRole = useUserRole();
  const location = useLocation();

  if (!userRole) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to projects page if not authorized
    return <Navigate to="/projects" replace />;
  }

  return <>{children}</>;
} 