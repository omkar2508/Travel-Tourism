// D:/client/src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner/loading component
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not admin, redirect to home or unauthorized page
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />; // Or to a specific unauthorized page
  }

  // If logged in and admin, allow access
  return <Outlet />;
};

export default AdminRoute;