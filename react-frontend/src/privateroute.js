import React from "react";
import { Navigate } from "react-router-dom";

// A simple function to check if the user is logged in
const isAuthenticated = () => {
  // You can check if the user session exists or a token is stored
  return sessionStorage.getItem("username") ? true : false;
};

const PrivateRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
