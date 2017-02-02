import React from 'react';
import pin from '../assets/pin.png';

const PIN_SIZE = 30;

const Bus = props => (
  <div
    className="marker"
    style={{
      position: 'absolute',
      left: -PIN_SIZE,
      top: -PIN_SIZE,
      cursor: 'pointer',
      color: 'white',
    }}
  >
    <img src={pin} alt={props.name_en} title={props.name_en} style={{ height: '30px' }} />
    {props.name_en}
  </div>
);

Bus.defaultProps = {
  name_en: null,
};

Bus.propTypes = {
  name_en: React.PropTypes.string,
};

export default Bus;
