import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css';

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
          onSelect={startStop => this.props.handleStartEndSelect(startStop, null)}
        />
        <AutoCompleteSearch
          source={busStops}
          placeholder="End"
          onSelect={endStop => this.props.handleStartEndSelect(null, endStop)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { busStops } = state;

  return {
    busStops,
  };
}

function mapDispatchToProps(dispatch, ownProps, stateProps) {
  return {
    loadAllBusStops: () => {
      dispatch(loadAllBusStops(busStops));
    },
    handleStartEndSelect: (startStop, endStop) => {
      dispatch(selectStartEndStop(startStop, endStop));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
