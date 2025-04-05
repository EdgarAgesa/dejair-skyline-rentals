
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ element, requireAdmin = false }) => {
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/user-dashboard" replace />;
  }
  
  return element;
};

export default ProtectedRoute;
