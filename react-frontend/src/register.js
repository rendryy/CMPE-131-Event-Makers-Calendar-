import React, { useState } from "react";
import { useNavigate, redirect, useRoutes, Route, Link } from "react-router-dom";
import axios from "axios";
import './register.css';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [input, setInput] = useState('')
  const [error, setErrorMessage] = useState('')
  const [sucess, setSuccessMessage] = useState('')
  const navigate = useNavigate();


  const onButtonClick = async() =>
    {
        setUsernameError('')
        if ('' == username)
          {
            setUsernameError('  Username/Password cannot be blank')
            return
          }
        setPasswordError('')
        if('' == password)
          {
            setPasswordError('  Password cannot be blank')
            return
          }
    
      try {
        const response = await axios.post('http://localhost:5000/register', 
        {
          username: username,
          password: password
        });
        if (response.status === 500)
          {
            setUsernameError('Username already in use')
          }
        if (response.status === 201) 
        {
          setSuccessMessage('Registration Successful!')
          navigate('/login');
        }
        else
        {
          setErrorMessage('Login attempt failed')
        }
      } catch (error) {
        setErrorMessage('Invalid username or password');
        console.error('Login failed:', error);
      }
    };
  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Register</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={username}
          placeholder="Enter your username here"
          onChange={(event) => setUsername(event.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{usernameError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
        type = "password"
        id = "password"
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          required
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Register'} />
      </div>
      <div>
      <Link to="/home" className="btn btn-primary">Back</Link> 
      </div>
        

  </div>

  );
};

export default Register;
