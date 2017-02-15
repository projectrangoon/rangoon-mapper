import React from 'react';
import './BusStop.css';

const Bus = ({ color }) => (
  <div className="marker" style={{ background: color }}>
    <div className="pulse" />
  </div>
);

Bus.defaultProps = {
  color: '#E54D42',
};

Bus.propTypes = {
  color: React.PropTypes.string,
};

export default Bus;
