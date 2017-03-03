import React from 'react';
import { connect } from 'react-redux';

import { selectStartStop, selectEndStop, swapStops } from '../../actions/map';
import AutoCompleteSearch from '../../components/AutoCompleteSearch';
import Journey from '../../components/Journey';
import LoadingJourney from '../../components/LoadingJourney';

import allBusStops from '../../../../experiment/unique_stops.json';

const renderJourney = (routePath, startStop, endStop, busServices, calculatingRoute) => {
  if (routePath && startStop && endStop) {
    return (
      <Journey
        routePath={routePath}
        busServices={busServices}
        startStop={startStop}
        endStop={endStop}
        calculatingRoute={calculatingRoute}
      />
    );
  }
  return null;
};

const Sidebar = (props) => {
  const { handleStartSelect, handleEndSelect, handleSwap, map, params } = props;
  const { busStopsMap, routePath, busServices, startStop, endStop, calculatingRoute } = map;
  return (
    <div className="container">
      <div className="row top-form">
        <form className="col" style={{ paddingRight: 0 }}>
          <AutoCompleteSearch
            source={allBusStops}
            placeholder="Start"
            onSelect={stop => handleStartSelect(stop)}
            defaultStop={busStopsMap[params.startStop] || null}
          />
          <AutoCompleteSearch
            source={allBusStops}
            placeholder="End"
            onSelect={stop => handleEndSelect(stop)}
            defaultStop={busStopsMap[params.endStop] || null}
          />
        </form>
        <button onClick={handleSwap}>
          <i className="material-icons swap">swap_vert</i>
        </button>
      </div>
      <div className="row">
        { calculatingRoute ? (
          <LoadingJourney />
        ) : (
          renderJourney(routePath, startStop, endStop, busServices, calculatingRoute)
        )}
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
  handleStartSelect: React.PropTypes.func.isRequired,
  handleEndSelect: React.PropTypes.func.isRequired,
  handleSwap: React.PropTypes.func.isRequired,
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
  handleSwap: _ => dispatch(swapStops()),
  handleStartSelect: startStop => dispatch(selectStartStop(startStop)),
  handleEndSelect: endStop => dispatch(selectEndStop(endStop)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
