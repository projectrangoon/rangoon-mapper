import React, { PropTypes } from 'react';
import { groupBy } from '../utils';
import BusLine from './BusLine';

const Journey = ({ path, busServices }) => {
  const busLines = groupBy(path.path, 'service_name');

  return (
    <section className="col-sm journey">
      <h1>Journey Details</h1>
      {busLines ?
       busLines.map((busLine, index) =>
         // eslint-disable-next-line react/no-array-index-key
         <BusLine key={index} stops={busLine} busServices={busServices} />)
       : null }
    </section>
  );
};

Journey.propTypes = {
  path: PropTypes.any.isRequired,
  busServices: PropTypes.object.isRequired,
};

export default Journey;
