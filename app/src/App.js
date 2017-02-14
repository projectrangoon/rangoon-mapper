import React, { Component } from 'react';
import { connect } from 'react-redux';
import graph from '../../experiment/adjancencyList.json';
import busStopsMap from '../../experiment/stops_map.json';
import busServices from '../../experiment/bus_services.json';
import { adjacencyListLoaded } from './actions/map';
import './styles/main.scss';
// import { distance } from './utils';

class App extends Component {
  componentWillMount() {
    this.props.loadGraph();
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <aside className="col-sm-12 col-md-3 sidebar">
            {this.props.sidebar}
          </aside>
          <main className="col-sm-12 col-md-9 map">
            {this.props.main}
          </main>
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  sidebar: null,
};

App.propTypes = {
  main: React.PropTypes.element.isRequired,
  sidebar: React.PropTypes.element,
  loadGraph: React.PropTypes.func.isRequired,
};


const mapDispatchToProps = dispatch => ({
  loadGraph: () => dispatch(adjacencyListLoaded(graph, busStopsMap, busServices)),
});

const mapStateToProps = () => ({

});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
