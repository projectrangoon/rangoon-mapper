import React, { Component, PropTypes } from 'react';

class Journey extends Component {
  constructor(props) {
    super(props);
    this.setState({
      test: null,
    });
  }
  render() {
    const { path, busServices } = this.props;
    return (
      <section className="row journey">
        <h1>Journey Details</h1>
        {path.path ?
          <ul className="busstop-list">
            {path.path.map(stop => (
              <li key={stop.bus_stop_id} className="busstop">
                <span
                  className="logo"
                  style={{ backgroundColor: busServices[stop.service_name].color }}
                >
                  {stop.service_name}
                </span>
                {stop.name_en} {stop.name_mm}
              </li>
            ))}
          </ul>
        : null }
      </section>
    );
  }
}

Journey.propTypes = {
  path: PropTypes.any.isRequired,
  busServices: PropTypes.object.isRequired,
};

export default Journey;
