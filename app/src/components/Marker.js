import React from 'react';

const K_WIDTH = 10;
const K_HEIGHT = 10;

const markerStyle = {
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  border: '5px solid #f44336',
  borderRadius: K_HEIGHT,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4,
};

const Marker = props => (
  <div style={markerStyle}>
    {props.text}
  </div>
  );

Marker.defaultProps = {
  text: null,
};

Marker.propTypes = {
  text: React.PropTypes.string,
};

export default Marker;
