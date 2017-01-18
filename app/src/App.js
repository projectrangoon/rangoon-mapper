import React, { Component } from 'react';

import './App.css';

class App extends Component {
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
