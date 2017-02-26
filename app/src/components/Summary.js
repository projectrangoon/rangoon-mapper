import React, { PropTypes } from 'react';
import _ from 'lodash';

const Summary = ({ routePath }) => {
  const services = _.keys(_.groupBy(routePath.path || [], 'service_name'));
  // eslint-disable-next-line no-console
  console.log(services);
  return (
    <div className="summary" />
  );
};

Summary.propTypes = {
  routePath: PropTypes.object.isRequired,
};

export default Summary;
