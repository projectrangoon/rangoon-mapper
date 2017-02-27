import React from 'react';

const Bus = ({ color, midpoint, name_mm }) => {
  if (midpoint) {
    return (
      <div>
        <div className="midpoint-marker" style={{ background: color }} />
        <div className="name myanmar" style={{ background: color }}>{name_mm}</div>
      </div>
    );
  }
  return (
    <div>
      <div className="marker" style={{ background: color }}>
        <div className="pulse" />
      </div>
      <div className="name" style={{ background: color }}>{name_mm}</div>
    </div>
  );
};

Bus.defaultProps = {
  color: '#E54D42',
  midpoint: false,
  name_mm: '',
};

Bus.propTypes = {
  color: React.PropTypes.string,
  midpoint: React.PropTypes.bool,
  name_mm: React.PropTypes.string,
};

export default Bus;
