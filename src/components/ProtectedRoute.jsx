
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { useToast } from "@/hooks/use-toast";

const ProtectedRoute = ({ element, requireAdmin = false, requireSuperAdmin = false }) => {
  const { toast } = useToast();
  const location = useLocation();
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();
  const isSuperAdmin = authService.isSuperAdmin();
  
  // Check for session-only login (when "Remember me" wasn't checked)
  const sessionOnly = sessionStorage.getItem('session_only') === 'true';
  
  if (!isLoggedIn) {
    toast({
      title: "Authentication required",
      description: "Please log in to access this page",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requireSuperAdmin && !isSuperAdmin) {
    toast({
      title: "Access denied",
      description: "This page requires super admin privileges",
      variant: "destructive",
    });
    return <Navigate to={isAdmin ? "/admin-dashboard" : "/user-dashboard"} replace />;
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
