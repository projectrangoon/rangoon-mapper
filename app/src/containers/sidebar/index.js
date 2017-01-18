import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css'

import { loadAllBusStops, selectStartStop, selectEndStopAndCalculateRoute } from '../../actions/busStops';
import AutoCompleteSearch from '../../components/AutoCompleteSearch';
const busStops = require('../../../../experiment/bus_stops.json');

class Sidebar extends Component {
    componentWillMount() {
        this.props.loadAllBusStops();
    }

    render() {
        return (
          <div>
              <AutoCompleteSearch
                  source={busStops}
                  placeholder="Start"
                  onSelect={this.props.handleStartStopSelect}
              />
              <AutoCompleteSearch
                  source={busStops}
                  placeholder="End"
                  onSelect={this.props.handleEndStopSelect}
              />
          </div>
        );
    }
}

function mapStateToProps(state) {
  const { busStops } = state;

  return {
    bus_stops: busStops,
  }
}

function mapDispatchToProps(dispatch, ownProps, stateProps) {
  return {
    loadAllBusStops: () => {
        dispatch(loadAllBusStops(busStops));
    },
    handleStartStopSelect: (bus_stop) => {
        dispatch(selectStartStop(bus_stop));
    },
    handleEndStopSelect: (bus_stop) => {
        dispatch(selectEndStopAndCalculateRoute(bus_stop));
    },
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar)