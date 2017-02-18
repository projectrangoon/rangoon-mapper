import React, { Component, PropTypes } from 'react';
import _ from 'lodash';


class BusLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
    };
  }

  toggleList = () => {
    this.setState({
      isOpened: !this.state.isOpened,
    });
  }

  render() {
    const { stops, busServices } = this.props;
    const start = stops[0];
    const end = stops[stops.length - 1];
    const middle = stops.slice(1, -1);
    const uniqueId = _.uniqueId('busline');
    const color = busServices[start.service_name].color;

    return (
      <ul className="busline">
        <li className="start">
          <span className="logo" style={{ backgroundColor: color }} >
            {start.service_name}
          </span>
          {start.name_mm}
        </li>

        <li className="middle">
          <span className="line" style={{ backgroundColor: color }} />
          <input id={uniqueId} type="checkbox" onChange={this.toggleList} />
          { middle.length ?
            <label htmlFor={uniqueId}>{middle.length} stops</label>
          : null }
          <ul className="midstops">
            {middle.map(stop => (
              <li key={stop.bus_stop_id} className="midstop">
                <span className="notch" style={{ backgroundColor: color }} />
                {stop.name_mm}
              </li>
            ))}
          </ul>
        </li>

        <li className="end">
          <span className="logo" style={{ backgroundColor: color }} >
            {end.service_name}
          </span>
          {end.name_mm}
        </li>
      </ul>
    );
  }
}

BusLine.defaultProps = {
  stops: [],
  busServices: null,
};

BusLine.propTypes = {
  stops: PropTypes.array,
  busServices: PropTypes.any,
};

export default BusLine;
