import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import Users from './user/pages/Users';
import Auth from './user/pages/Auth';
import UserPlaces from './places/pages/UserPlaces';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
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
          <Route exact path="/auth">
            <Auth />
          </Route>
          <Route exact path="/:userId/places">
            <UserPlaces />
          </Route>
          <Route exact path="/places/new">
            <NewPlace />
          </Route>
          <Route exact path="/places/:placeId">
            <UpdatePlace />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
