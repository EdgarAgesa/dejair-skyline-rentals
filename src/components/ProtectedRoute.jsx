
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { useToast } from "@/hooks/use-toast";

const ProtectedRoute = ({ element, requireAdmin = false }) => {
  const { toast } = useToast();
  const location = useLocation();
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();
  
  if (!isLoggedIn) {
    toast({
      title: "Authentication required",
      description: "Please log in to access this page",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    toast({
      title: "Access denied",
      description: "This page requires admin privileges",
      variant: "destructive",
    });
    return <Navigate to="/user-dashboard" replace />;
  }
  
  return element;
};

export default ProtectedRoute;
