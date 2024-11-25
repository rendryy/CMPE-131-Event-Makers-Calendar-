import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Route, useNavigate } from "react-router-dom";
import './login.css';
import {Link} from "react-router-dom"

const Login = () =>
 {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [error, setErrorMessage] = useState('')
  const navigate = useNavigate()

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
        const response = await axios.post('http://localhost:5000/login', 
        {
          username: username,
          password: password
        });
  
        if (response.status === 200) 
        {
          sessionStorage.setItem('username', username);
          navigate('/calendar');
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
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={username}
          placeholder="Enter your username here"
          onChange={(ev) => setUsername(ev.target.value)}
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
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
      <div>
        <label className="errorlab">{error}</label>
      </div>
      <div>
      <Link to="/home" className="btn btn-primary">Back</Link> 
      </div>
    </div>
  )
}





export default Login;
