import React from 'react';
import './BusStop.css';

const Bus = () => (
  <div className="marker">
    <div className="pulse" />
  </div>
);

Bus.defaultProps = {
  name_en: null,
};

Bus.propTypes = {
  name_en: React.PropTypes.string,
};

export default Bus;
