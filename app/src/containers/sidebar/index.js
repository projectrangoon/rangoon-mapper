import React from 'react';
import { connect } from 'react-redux';

import { selectStartStop, selectEndStop } from '../../actions/map';
import AutoCompleteSearch from '../../components/AutoCompleteSearch';
import Journey from '../../components/Journey';
import LoadingJourney from '../../components/LoadingJourney';

import allBusStops from '../../../../experiment/unique_stops.json';

const Sidebar = (props) => {
  const { handleStartSelect, handleEndSelect, map, params } = props;
  const { busStopsMap, routePath, busServices, startStop, endStop, calculatingRoute } = map;
  return (
    <div className="container-fluid">
      <div className="row">
        <form className="col-sm">
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
      </div>
      <div className="row">
        { calculatingRoute ? (
          <LoadingJourney />
        ) : (
          <div>
            { routePath && startStop && endStop ?
              <Journey
                routePath={routePath}
                busServices={busServices}
                startStop={startStop}
                endStop={endStop}
                calculatingRoute={calculatingRoute}
              />
            : null }
          </div>
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
  handleStartSelect: startStop => dispatch(selectStartStop(startStop)),
  handleEndSelect: endStop => dispatch(selectEndStop(endStop)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
