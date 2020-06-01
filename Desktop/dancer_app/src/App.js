import React from 'react';
import Home from './pages/homePage';
import Map from './pages/mapPage';
import Class from './pages/classPage';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


function App() {
  return (
    <Router>
    <>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/class" component={Class}/>
        <Route exact path="/map" component={Map}/>
      </Switch>
    </>
  </Router>
  );
}

export default App;
