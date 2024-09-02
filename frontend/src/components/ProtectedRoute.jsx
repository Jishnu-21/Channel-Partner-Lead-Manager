import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredType }) => {
  // Retrieve the user type from Redux state
  const userType = useSelector((state) => state.user.userType);
  // Check for token in localStorage to verify if user is logged in
  const token = localStorage.getItem('token');

  // If the token is not present or the user type does not match the required type
  if (!token || (requiredType && userType !== requiredType)) {
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated and has the required user type, render the children
  return children;
};

export default ProtectedRoute;
