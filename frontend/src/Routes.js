import React from "react";
import { Route, Switch } from "react-router-dom";
import { useAppContext } from './libs/contextLib';
import Home from "./containers/Home";
import Config from './containers/Config';
import NotFound from './containers/NotFound';

export default function Routes() {
  const { isAuthenticated } = useAppContext();
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      {isAuthenticated &&
        <>
          <Route eact path="/config">
            <Config />
          </Route>
        </>
      }
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
