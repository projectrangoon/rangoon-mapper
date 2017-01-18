import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css'

import { loadAllBusStops, selectStartEndStop } from '../../actions/busStops';
import AutoCompleteSearch from '../../components/AutoCompleteSearch';
const busStops = require('../../../../experiment/all_bus_stops.json');

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
                  onSelect={(start_stop) => this.props.handleStartEndSelect(start_stop, null)}
              />
              <AutoCompleteSearch
                  source={busStops}
                  placeholder="End"
                  onSelect={(end_stop) => this.props.handleStartEndSelect(null, end_stop)}
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
    handleStartEndSelect: (start_stop, end_stop) => {
        dispatch(selectStartEndStop(start_stop, end_stop));
    }
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar)