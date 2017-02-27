import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';


class BusLine extends Component {
  constructor(props) {
    super(props);
    this.uniqueId = _.uniqueId('busline');
    this.state = {
      isOpened: false,
    };
  }

  toggleList = (e) => {
    e.preventDefault();
    this.setState({
      isOpened: !this.state.isOpened,
    });
  }

  render() {
    const { stops, busServices } = this.props;
    const start = stops[0];
    const end = stops[stops.length - 1];
    const middle = stops.slice(1, -1);
    let color;
    if (start.service_name === 0) {
      color = '#ffffff';
    } else {
      color = busServices[start.service_name].color;
    }


    return (
      <div>
        <ul className="busline">
          <li className="start myanmar">
            <span className="logo" style={{ backgroundColor: color }} >
              {start.service_name}
            </span>
            <i className="material-icons">directions_bus</i>
            {start.name_mm}
          </li>

          {start.bus_stop_id !== end.bus_stop_id &&
          <div>
            <li className="middle">
              <span className="line" style={{ backgroundColor: color }} />
              {middle.length &&
                <button type="button" onClick={this.toggleList}>
                  {middle.length} stops
                </button>
              }
              <ReactCSSTransitionGroup
                transitionName="collapse"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
              >
                {this.state.isOpened &&
                  <ul className="midstops">
                    {middle.map(stop => (
                      <li key={stop.bus_stop_id} className="midstop myanmar">
                        <span className="notch" style={{ backgroundColor: color }} />
                        {stop.name_mm}
                      </li>
                    ))}
                  </ul>
                }
              </ReactCSSTransitionGroup>
            </li>

            <li className="end myanmar">
              <span className="logo" style={{ backgroundColor: color }} >
                {end.service_name}
              </span>
              <i className="material-icons">directions_bus</i>
              {end.name_mm}
            </li>
          </div>
          }
        </ul>
      </div>
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
