import React, { PropTypes } from 'react';
import _ from 'lodash';

const Walk = ({ from, to }) => {
  const distance = from.distance || to.distance;
  const roundDistance = _.round(distance * 1000, -2);

  return (
    <div className="walk">
      <i className="material-icons">directions_walk</i>
      Walk to <i className="material-icons">directions_bus</i>{to.name_mm}
      <span className="distance">{roundDistance} m</span>
    </div>
  );
};

Walk.propTypes = {
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired,
};

export default Walk;
