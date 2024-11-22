import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './register.css';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [error, setErrorMessage] = useState('')

  const navigate = useNavigate();

  const onButtonClick = async() =>
    {
        setUsernameError('')
        if ('' == username)
          {
            setUsernameError('  Username cannot be blank')
            return
          }
        setPasswordError('')
        if('' == password)
          {
            setPasswordError('  Password cannot be blank')
            return
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
          onChange={(ev) => setUsername(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{usernameError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
    </div>
  );
};

export default Register;
