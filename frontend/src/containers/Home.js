import React, { useState } from "react";
import { Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import LoaderButton from '../components/LoaderButton';
import { useAppContext } from '../libs/contextLib';
import { onError } from '../libs/errorLib';
import { useFormFields } from '../libs/hooksLib';
import { createSession } from '../libs/sessionLib';
import socket from '../libs/socketLib';
import "./Home.css";

export default function Home() {
  const { isAuthenticated, userHasAuthenticated, setFlags } = useAppContext();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange, resetFields] = useFormFields({
    username: '',
    password: ''
  });

  function validateForm() {
    return (fields.username.length > 0 && fields.password.length > 0);
  }

  async function handleLogin(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const result = await axios.post('/login', {
        username: fields.username,
        password: fields.password
      });
      createSession(result.data.accessToken);
      setFlags({});
      userHasAuthenticated(true);
      resetFields({
        username: '',
        password: ''
      });
      socket.connectSocket();
      setIsLoading(false);
      if (sessionStorage.getItem('needConfig') === 'true') {
        history.push('/config');
      } else {
        history.push('/');
      }
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function onClickListen() {
    history.push('/listen');
  }

  function onClickConfig() {
    history.push('/config');
  }

  return (
    <div className="Home">
      <div className="lander">
        <h1>Web-AX25</h1>
        {isAuthenticated 
        ? <>
            <Button onClick={onClickListen}>Listen</Button>
            &nbsp;
            <Button onClick={onClickConfig}>Configure</Button>
          </>
        : <>
          <form onSubmit={handleLogin}>
            <FormGroup controlId="username">
              <FormLabel>Username</FormLabel>
              <FormControl
                autoFocus
                type="username"
                value={fields.username}
                onChange={handleFieldChange}
              />
            </FormGroup>
            <FormGroup controlId="password">
              <FormLabel>Password</FormLabel>
              <FormControl
                value={fields.password}
                onChange={handleFieldChange}
                type="password"
              />
            </FormGroup>
            <LoaderButton
              block
              isLoading={isLoading}
              disabled={!validateForm()}
              type="submit"
            >
              Login
            </LoaderButton>
          </form>
        </>
        }
      </div>
    </div>
  );
}