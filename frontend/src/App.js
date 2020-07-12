import React, { useState, useEffect, useReducer } from "react";
import { Link, useHistory } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { AppContext } from './libs/contextLib';
import { checkExistingSession, destroySession } from './libs/sessionLib';
import socket from './libs/socketLib';
import Routes from './Routes';
import "./App.css";
import { FlagsProvider } from "./libs/featureFlags";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [packets, dispatchPacket] = useReducer(packetReducer, []);
  const [flags, setFlags] = useState({});
  const history = useHistory();

  useEffect(() => {
    onLoad();
  }, []);

  function onLoad() {
    socket.on('packet', packet => dispatchPacket({ type: 'add', packet }));
    const validSession = checkExistingSession();
    if (validSession) {
      socket.connectSocket();
      userHasAuthenticated(true);
      // TODO: set feature flags
      // const featureFlags = axios.get('/some_url');
      // setFlags(featureFlags);

    }
    setIsAuthenticating(false);
  }

  function packetReducer(state, action) {
    switch(action.type) {
      case 'add':
        return [...state, action.packet];
      case 'clear':
        return [];
      default:
        console.log('Invalid action type');
        return state;
    }
  }

  function handleLogout() {
    socket.disconnectSocket();
    dispatchPacket({ type: 'clear' });
    destroySession();
    setFlags({});
    userHasAuthenticated(false);
    history.push('/');
  }

  return (
    !isAuthenticating &&
    <div className="App container">
      <FlagsProvider flags={flags}>
        <Navbar sticky="top" fluid="true" collapseOnSelect className="topnav">
          <Navbar.Brand>
            <Link to="/">Web-AX25</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ml-auto">
              {isAuthenticated &&
                <>
                  <LinkContainer to="/listen">
                    <Nav.Link>Listen</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/config">
                    <Nav.Link>Configure</Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated, setFlags, packets }}>
          <Routes />
        </AppContext.Provider>
      </FlagsProvider>
    </div>
  );
}

export default App;