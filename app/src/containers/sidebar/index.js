import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css';

import loadAllBusStops from '../../actions/busStops';
import { selectStartEndStop } from '../../actions/map';
import AutoCompleteSearch from '../../components/AutoCompleteSearch';

import allBusStops from '../../../../experiment/unique_stops.json';

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

Sidebar.propTypes = {
  loadAllBusStops: React.PropTypes.func.isRequired,
  handleStartEndSelect: React.PropTypes.func.isRequired,
};

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
