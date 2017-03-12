import React from 'react';
import { connect } from 'react-redux';

import { selectStartStop, selectEndStop, swapStops, changeStartStopValue, changeEndStopValue } from '../../actions/map';
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
  const {
    handleStartSelect,
    handleEndSelect,
    handleStartStopValueChange,
    handleEndStopValueChange,
    handleSwap,
    map,
  } = props;
  const {
    routePath,
    busServices,
    startStop,
    startStopValue,
    endStopValue,
    endStop,
    calculatingRoute,
    swappingStops,
  } = map;
  return (
    <div className="container">
      <div className="row top-form">
        <form className="col" style={{ paddingRight: 0 }}>
          <AutoCompleteSearch
            source={allBusStops}
            placeholder="Start"
            onSelect={stop => handleStartSelect(stop)}
            defaultValue={startStopValue}
            onChange={value => handleStartStopValueChange(value)}
          />
          <AutoCompleteSearch
            source={allBusStops}
            placeholder="End"
            onSelect={stop => handleEndSelect(stop)}
            defaultValue={endStopValue}
            onChange={value => handleEndStopValueChange(value)}
          />
        </form>
        {swappingStops || !startStop || !endStop ? (
          <button className="disabled">
            <i className="material-icons swap rotate">swap_vert</i>
          </button>
        ) : (
          <button onClick={handleSwap}>
            <i className="material-icons swap">swap_vert</i>
          </button>
        )}
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
  handleStartStopValueChange: React.PropTypes.func.isRequired,
  handleEndStopValueChange: React.PropTypes.func.isRequired,
  handleSwap: React.PropTypes.func.isRequired,
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
  handleSwap: () => {
    dispatch(swapStops());
  },
  handleStartSelect: startStop => dispatch(selectStartStop(startStop)),
  handleEndSelect: endStop => dispatch(selectEndStop(endStop)),
  handleStartStopValueChange: value => dispatch(changeStartStopValue(value)),
  handleEndStopValueChange: value => dispatch(changeEndStopValue(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
