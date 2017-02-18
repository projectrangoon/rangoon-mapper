import React from 'react';

const Bus = ({ color, midpoint }) => {
  if (midpoint) {
    return (
      <div className="midpoint-marker" style={{ background: color }} />
    );
  }
  return (
    <div className="marker" style={{ background: color }}>
      <div className="pulse" />
    </div>
  );
};

Bus.defaultProps = {
  color: '#E54D42',
  midpoint: false,
};

Bus.propTypes = {
  color: React.PropTypes.string,
  midpoint: React.PropTypes.bool,
};

export default Bus;
