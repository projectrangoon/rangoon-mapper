import React, { Component } from 'react';
import { connect } from 'react-redux';
import graph from '../../experiment/adjancencyList.json';
import { adjacencyListLoaded } from './actions/map';
import './App.css';
// import { distance } from './utils';

class App extends Component {
  componentWillMount() {
    this.props.loadGraph();
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

App.propTypes = {
  loadGraph: React.PropTypes.func.isRequired,
};


const mapDispatchToProps = dispatch => ({
  loadGraph: () => dispatch(adjacencyListLoaded(graph)),
});

const mapStateToProps = () => ({

});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
