import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function PrivateRoute({ children }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
export default PrivateRoute;
