import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  // Check if user is authenticated (for example, by checking sessionStorage)
  return sessionStorage.getItem("username") ? true : false;
};

const PrivateRoute = ({ element }) => {
  // If the user is authenticated, render the element (calendar, etc.)
  // Otherwise, redirect to the login page
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
