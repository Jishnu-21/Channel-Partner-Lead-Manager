import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check for authentication token
  const userType = useSelector((state) => state.user.userType); // Get user type from Redux store
  
   console.log('usr',userType)

  // If the user is logged in, redirect based on user type
  if (token) {
    // Check for user type and redirect to the correct path
    if (userType === 'channelPartner') {
      return <Navigate to="/channel-partner" replace />;
    } else if (userType === 'internalUser') {
      return <Navigate to="/internal-user" replace />;
    }
  }

  return children; 
};

export default PublicRoute;
