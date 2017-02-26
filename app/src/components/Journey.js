import React, { PropTypes } from 'react';
import _ from 'lodash';
import { groupBy } from '../utils';
import BusLine from './BusLine';

const Journey = ({ routePath, busServices }) => {
  const busLines = groupBy(routePath.path || [], 'service_name');

  return (
    <section className="col-sm journey">
      <h1>Journey Details</h1>
      {busLines ?
       busLines.map(busLine =>
         <BusLine key={_.uniqueId('busline')} stops={busLine} busServices={busServices} />)
       : null }
    </section>
  );
};

Journey.propTypes = {
  routePath: PropTypes.object.isRequired,
  busServices: PropTypes.object.isRequired,
};

export default Journey;
