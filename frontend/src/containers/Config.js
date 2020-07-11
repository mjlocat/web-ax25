import React, { useState, useEffect } from "react";
import { FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import LoaderButton from '../components/LoaderButton';
import { onError } from '../libs/errorLib';
import { useFormFields } from '../libs/hooksLib';
import { createSession, destroySession } from '../libs/sessionLib';
import "./Config.css";

export default function Config() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange, resetFields] = useFormFields({
    username: '',
    password: '',
    confirmpassword: '',
    callsign: '',
    realName: ''
  });

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      const config = await axios.get('/appconfig');
      resetFields({
        username: sessionStorage.getItem('username'),
        password: '',
        confirmpassword: '',
        callsign: config.data.callsign || '',
        realName: sessionStorage.getItem('realName') || ''
      });
    } catch(e) {
      onError(e);
    }

  }

  function usernameValid() {
    return fields.username.length > 0;
  }

  function callsignValid() {
    return fields.callsign.length > 0;
  }

  function nameValid() {
    return fields.realName.length > 0;
  }

  function passwordValid() {
    if (fields.username !== sessionStorage.getItem('username')) {
      return (fields.password.length > 0 && fields.password === fields.confirmpassword);
    }
    return (fields.password.length === 0 || fields.password === fields.confirmpassword);
  }

  function validateForm() {
    return (
      usernameValid()
      && callsignValid()
      && passwordValid()
      && nameValid()
    );
  }

  async function updateConfig(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const result = await axios.post('/appconfig', {
        username: fields.username,
        password: fields.password.length ? fields.password : undefined,
        callsign: fields.callsign,
        realName: fields.realName
      });
      if (result.data.needNewLogin) {
        destroySession();
        const loginResult = await axios.post('/login', {
          username: fields.username,
          password: fields.password
        });
        createSession(loginResult.data.accessToken);
      }
      setIsLoading(false);
      if (result.data.needConfig !== 'true') {
        history.push('/');
      }
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Config">
      <div className="lander">
        <h1>Web-AX25 Config</h1>
        <form onSubmit={updateConfig}>
          <FormGroup controlId="username">
            <FormLabel>Primary Username</FormLabel>
            <FormControl
              value={fields.username}
              onChange={handleFieldChange}
            />
          </FormGroup>
          <FormGroup controlId="password">
            <FormLabel>Update Password</FormLabel>
            <FormControl
              type="password"
              value={fields.password}
              onChange={handleFieldChange}
            />
          </FormGroup>
          <FormGroup controlId="confirmpassword">
            <FormLabel>Confirm Password</FormLabel>
            <FormControl
              type="password"
              value={fields.confirmpassword}
              onChange={handleFieldChange}
            />
          </FormGroup>
          <FormGroup controlId="callsign">
            <FormLabel>Station Callsign</FormLabel>
            <FormControl
              value={fields.callsign}
              onChange={handleFieldChange}
            />
          </FormGroup>
          <FormGroup controlId="realName">
            <FormLabel>Operator Name</FormLabel>
            <FormControl
              value={fields.realName}
              onChange={handleFieldChange}
            />
          </FormGroup>
          <LoaderButton
            block
            isLoading={isLoading}
            disabled={!validateForm()}
            type="submit"
          >
            Update Config
          </LoaderButton>
        </form>
      </div>
    </div>
  );
}