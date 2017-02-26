import React, { PropTypes } from 'react';

const Walk = ({ destination }) => (
  <div className="walk">
    <i className="material-icons">directions_walk</i>
    Walk to <i className="material-icons">directions_bus</i>{destination.name_mm}
  </div>
);

Walk.propTypes = {
  destination: PropTypes.object.isRequired,
};

export default Walk;
