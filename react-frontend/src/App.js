import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./login";
import Register from "./register";
import Calendar1 from "./calendar";
import Home from "./home";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home/>} />
        <Route exact path="/home" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/calendar" element={<Calendar1 />} />
      </Routes>
    </Router>
  );
};

export default App;

