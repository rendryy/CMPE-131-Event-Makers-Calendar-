import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login";
import Register from "./register";
import Calendar1 from "./calendar";
import Home from "./home";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  return sessionStorage.getItem("username") ? true : false;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protect the /calendar route */}
        <Route
          path="/calendar"
          element={isAuthenticated() ? <Calendar1 /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
