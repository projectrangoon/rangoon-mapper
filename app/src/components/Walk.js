import React, { PropTypes } from 'react';

const Walk = ({ destination }) => (
  <div className="walk">
    Walk to {destination.name_mm}
  </div>
);

Walk.propTypes = {
  destination: PropTypes.object.isRequired,
};

export default Walk;
