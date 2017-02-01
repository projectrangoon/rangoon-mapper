import React from 'react';

const Bus = props => (
  <div>
    {props.text}
  </div>
);

Bus.defaultProps = {
  text: null,
};

Bus.propTypes = {
  text: React.PropTypes.string,
};

export default Bus;
