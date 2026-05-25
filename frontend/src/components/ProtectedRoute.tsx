import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="dashboard-floral-bg relative flex min-h-screen items-center justify-center">
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;
