import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { AppContext } from './libs/contextLib';
import { onError } from './libs/errorLib';
import Routes from './Routes';
import "./App.css";
import { FlagsProvider } from "./libs/featureFlags";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [flags, setFlags] = useState({});
  const history = useHistory();

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      // await Auth.currentSession();
      // userHasAuthenticated(true);
      // const featureFlags = await API.get('gift-exchange-group', '/features');
      // setFlags(featureFlags);
      // TODO: This all needs to be replaced with JWT and Axios
    } catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    // await Auth.signOut();
    // TODO: Replace signout function
    setFlags({});

    userHasAuthenticated(false);

    history.push('/');
  }

  return (
    !isAuthenticating &&
    <div className="App container">
      <FlagsProvider flags={flags}>
        <Navbar fluid="true" collapseOnSelect>
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
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated, setFlags }}>
          <Routes />
        </AppContext.Provider>
      </FlagsProvider>
    </div>
  );
}

export default App;