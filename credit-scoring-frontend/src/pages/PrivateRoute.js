import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token'); // This check if the user has a token

  if (!token) {
    // If no token, this will redirect to login
    return <Navigate to="/login" replace />;
  }

  // If token exists, allow them to authority to see the page
  return children;
}

export default PrivateRoute;
