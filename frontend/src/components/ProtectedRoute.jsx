import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log('ProtectedRoute: isAuthenticated =', isAuthenticated, 'loading =', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: User authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute; 