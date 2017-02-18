import React, { PropTypes } from 'react';
import BusLine from './BusLine';

const Journey = ({ path, busServices }) =>
  <section className="col-sm journey">
    <h1>Journey Details</h1>
    {path ?
      path.map((busLine, index) =>
        // eslint-disable-next-line react/no-array-index-key
        <BusLine key={index} stops={busLine} busServices={busServices} />)
      : null }
  </section>;

Journey.propTypes = {
  path: PropTypes.any.isRequired,
  busServices: PropTypes.object.isRequired,
};

export default Journey;
