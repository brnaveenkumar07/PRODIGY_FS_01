import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [_user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getMe();
      const userData = response.data;

      if (requiredRole && userData.role !== requiredRole) {
        setIsAuthorized(false);
        return;
      }

      setUser(userData);
      setIsAuthorized(true);
    } catch {
      setIsAuthorized(false);
    }
  };

  if (isAuthorized === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
