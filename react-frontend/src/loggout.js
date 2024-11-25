import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/logout');
      if (response.status === 200) {
        sessionStorage.clear(); // Clear session storage on the client side
        navigate('/login'); // Redirect to the login page
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <button onClick={handleLogout} style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
    }}>
      Logout
    </button>
  );
};

export default LogoutButton;
