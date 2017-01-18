import React, { Component } from 'react';
import busStops from '../../experiment/unique_stops.json';
import createLogger from 'redux-logger';

import './App.css';

class App extends Component {
  componentWillMount() {
  }
  render() {
    return (
      <div className="App">
          <section id="Map">
            {this.props.main}
          </section>
          <aside id="Sidebar">
            {this.props.sidebar}
          </aside>
      </div>
    );
  }
}

export default App;
