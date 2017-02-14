import React from 'react';
import { connect } from 'react-redux';

import { selectStartEndStop } from '../../actions/map';
import AutoCompleteSearch from '../../components/AutoCompleteSearch';

import allBusStops from '../../../../experiment/unique_stops.json';

const Sidebar = (props) => {
  const { handleStartEndSelect, map, query } = props;
  const { busStopsMap } = map;
  return (
    <div className="container">
      <div className="row">
        <form className="col-sm">
          <AutoCompleteSearch
            source={allBusStops}
            placeholder="Start"
            onSelect={startStop => handleStartEndSelect(startStop, null)}
            defaultStop={busStopsMap[query.startStop] || null}
          />
          <AutoCompleteSearch
            source={allBusStops}
            placeholder="End"
            onSelect={endStop => handleStartEndSelect(null, endStop)}
            defaultStop={busStopsMap[query.endStop] || null}
          />
        </form>
      </div>
      <div className="row">
        <h1>Results</h1>
      </div>
    </div>
  );
};

Sidebar.defaultProps = {
  query: {
    startStop: null,
    endStop: null,
  },
};

Sidebar.propTypes = {
  handleStartEndSelect: React.PropTypes.func.isRequired,
  query: React.PropTypes.object,
  map: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const {
    busStops,
    map,
  } = state;
  const { query } = ownProps.location;

  return {
    busStops,
    map,
    query,
  };
};

const mapDispatchToProps = dispatch => ({
  handleStartEndSelect: (startStop, endStop) => dispatch(selectStartEndStop(startStop, endStop)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
