import React from 'react';
import './App.css';
import Home from './Home/Home';
import Player from './Player/Player';
import Result from './Result/Result';

import {Route, Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="main-body">
        <Switch>
          <Route path="/play">
            <Player />
          </Route>
          <Route path="/result">
            <Result />
          </Route>
          <Route>
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
