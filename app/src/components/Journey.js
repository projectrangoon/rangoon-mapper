import React, { PropTypes } from 'react';
import _ from 'lodash';
import { groupBy } from '../utils';
import BusLine from './BusLine';
import Walk from './Walk';
import Summary from './Summary';

const Journey = ({ routePath, busServices, startStop, endStop }) => {
  const busLines = groupBy(routePath.path || [], 'service_name');
  const walkingToStartStop = startStop.bus_stop_id !== routePath.path[0].bus_stop_id;
  const walkingToEndStop = endStop.bus_stop_id !==
    routePath.path[routePath.path.length - 1].bus_stop_id;

  return (
    <section className="col-sm journey">
      <Summary routePath={routePath} />
      <div className="details">
        <h2>Suggested Route</h2>
        {walkingToStartStop && <Walk from={startStop} to={routePath.path[0]} />}
        {busLines ?
          busLines.map(busLine =>
            <BusLine key={_.uniqueId('busline')} stops={busLine} busServices={busServices} startStop={startStop} endStop={endStop} />)
        : null }
        {walkingToEndStop &&
        <Walk from={routePath.path[routePath.path.length - 1]} to={endStop} />}
      </div>
    </section>
  );
};

Journey.propTypes = {
  routePath: PropTypes.object.isRequired,
  busServices: PropTypes.object.isRequired,
  startStop: PropTypes.object.isRequired,
  endStop: PropTypes.object.isRequired,
};

export default Journey;
