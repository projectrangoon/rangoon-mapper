import React from 'react';
import { connect } from 'react-redux';

import { selectStartEndStop } from '../../actions/map';
import AutoCompleteSearch from '../../components/AutoCompleteSearch';
import Journey from '../../components/Journey';

import allBusStops from '../../../../experiment/unique_stops.json';

const Sidebar = (props) => {
  const { handleStartEndSelect, map, params } = props;
  const { busStopsMap, routePath, busServices, startStop, endStop } = map;
  return (
    <div className="container-fluid">
      <div className="row">
        <form className="col-sm">
          <AutoCompleteSearch
            source={allBusStops}
            placeholder="Start"
            onSelect={stop => handleStartEndSelect(stop, null)}
            defaultStop={busStopsMap[params.startStop] || null}
          />
          <AutoCompleteSearch
            source={allBusStops}
            placeholder="End"
            onSelect={stop => handleStartEndSelect(null, stop)}
            defaultStop={busStopsMap[params.endStop] || null}
          />
        </form>
      </div>
      <div className="row">
        { routePath ?
          <Journey
            routePath={routePath}
            busServices={busServices}
            startStop={startStop}
            endStop={endStop}
          />
        : null }
      </div>
    </div>
  );
};

Sidebar.defaultProps = {
  params: {
    startStop: null,
    endStop: null,
  },
};

Sidebar.propTypes = {
  handleStartEndSelect: React.PropTypes.func.isRequired,
  params: React.PropTypes.object,
  map: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const {
    busStops,
    map,
  } = state;

  return {
    busStops,
    map,
  };
};

const mapDispatchToProps = dispatch => ({
  handleStartEndSelect: (startStop, endStop) => dispatch(selectStartEndStop(startStop, endStop)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
