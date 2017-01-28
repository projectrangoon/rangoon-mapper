import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css';

import { loadAllBusStops, selectStartEndStop } from '../../actions/busStops';
import AutoCompleteSearch from '../../components/AutoCompleteSearch';

import allBusStops from '../../../../experiment/all_bus_stops.json';

class Sidebar extends Component {
  componentWillMount() {
    this.props.loadAllBusStops();
  }

  render() {
    return (
      <div>
        <AutoCompleteSearch
          source={allBusStops}
          placeholder="Start"
          onSelect={startStop => this.props.handleStartEndSelect(startStop, null)}
        />
        <AutoCompleteSearch
          source={allBusStops}
          placeholder="End"
          onSelect={endStop => this.props.handleStartEndSelect(null, endStop)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    busStops,
    startStop,
    endStop,
  } = state;
  return {
    busStops,
    startStop,
    endStop,
  };
};

const mapDispatchToProps = dispatch => ({
  loadAllBusStops: () => dispatch(loadAllBusStops(allBusStops)),
  handleStartEndSelect: (startStop, endStop) => dispatch(selectStartEndStop(startStop, endStop)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
