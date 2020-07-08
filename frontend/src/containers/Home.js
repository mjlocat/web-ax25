import React, { useState } from "react";
import { Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import LoaderButton from '../components/LoaderButton';
import { useAppContext } from '../libs/contextLib';
import { onError } from '../libs/errorLib';
import { useFormFields } from '../libs/hooksLib';
import "./Home.css";

export default function Home() {
  const { isAuthenticated, userHasAuthenticated, setFlags } = useAppContext();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
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
      console.log(result);
      setFlags({});
      userHasAuthenticated(true);
      handleFieldChange({
        username: '',
        password: ''
      });
      history.push('/');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function onClickListen() {
    history.push('/listen');
  }

  return (
    <div className="Home">
      <div className="lander">
        <h1>Web-AX25</h1>
        {isAuthenticated 
        ? <>
            <Button onClick={onClickListen}>Listen</Button>
            &nbsp;
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