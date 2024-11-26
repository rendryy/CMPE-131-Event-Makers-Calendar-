import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './home'; // Your Home component
import Login from './login'; // Your Login component
import Register from './register'; // Your Register component
import Calendar1 from './calendar'; // Your Calendar component
import PrivateRoute from './privateroute'; // Import your PrivateRoute component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/calendar"
          element={<PrivateRoute element={<Calendar1 />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
