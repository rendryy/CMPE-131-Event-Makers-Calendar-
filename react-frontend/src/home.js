import React from "react";
import { Link } from "react-router-dom";
import './home.css';

const Home = () => {
  return (
    <>
    <div className="home-container">
      <h1 className="home-title">Welcome to the Calendar App</h1>
      <p className="home-description">
       Login to start using the calendar application
      </p>
      <div className="home-buttons">
        <Link to="/login" className="home-button">
          Log In
        </Link>       
        <div className="register-link"></div>  
        <Link to="/register" className="register-link">
          Don't have an account? Click to here to register
        </Link>    


      </div>
    </div>
    </>
  );
};

export default Home;
