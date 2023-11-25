import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';

// Components

import NavigationMenu from './components/navigationbar';
import TitleBar from './components/titlebar';
// import Content from './components/Content';

// Styles
const App = () => {
  return (
    <div className="App">
      <Router>
        <NavigationMenu />
        <TitleBar />
        {/* <Switch>
          <Route path="/" component={Content} />
        </Switch> */}
      </Router>
    </div>
  );
};

export default App;