import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
// import './App.css';

const App = () => {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route exact path="/">
            <Users />
          </Route>
          <Route exact path="/places/new">
            <NewPlace />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
