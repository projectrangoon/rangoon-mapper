import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import allBusServices from '../../experiment/all_bus_stops.json';
import { adjacencyListLoaded } from './actions/map';
import './App.css';
// import { distance } from './utils';

class App extends Component {
  componentWillMount() {
    const stops = _.chain(allBusServices)
      .sortBy(['service_name', 'sequence'])
      .groupBy('service_name')
      .value();

    const adjacencyList = {};

    _.forIn(stops, (busStops, routeNo) => {
      const busStopsTillLast = busStops.filter((el, i, a) => (i + 1) !== a.length);
      busStopsTillLast.forEach((stop) => {
        const key = stop.bus_stop_id;
        if (!(key in adjacencyList)) {
          adjacencyList[key] = [];
        }
        let currentIndex = busStops.indexOf(stop);
        const nextStop = busStops[++currentIndex];
        // let d = distance(stop['lng'], stop['lat'], nextStop['lng'], nextStop['lat']);

        //const ns = {};
       // ns['stop'] = nextStop;
       // ns['distance'] = d;

        adjacencyList[key].push(nextStop);
      });
    });
    this.props.prepareAdjacencyList(adjacencyList);
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


const mapDispatchToProps = dispatch => ({
  prepareAdjacencyList: graph => dispatch(adjacencyListLoaded(graph)),
});

const mapStateToProps = state => ({

});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
