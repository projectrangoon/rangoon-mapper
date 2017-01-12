import React, { Component } from 'react';

import './App.css';
import Sidebar from './sidebar';
import Map from './map';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map />
        <Sidebar />
      </div>
    );
  }
}

export default App;
