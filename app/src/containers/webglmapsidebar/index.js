import React, { Component } from 'react';
import { connect } from 'react-redux';
import { map } from  'lodash';


class WebGLMapSidebar extends Component {
  constructor(props) {
    super(props);
  }

  onServiceClick = (e) => {
    console.log(e.target.name);
  }

  renderServices() {
    const services = this.props.busServices;
    return (
        <ul className="sidebar-list services-list">
        {map(services, (service, key) => (
            <li key={key} onClick={this.onServiceClick}>
              <span className="logo" style={{backgroundColor: service.color}}>{key}</span>
              <span>Bus Line: {key}</span>
            </li>
        ))}
        </ul>
    );
  }

  renderStopsForService(serviceName) {
    const stops = this.props.busServices[serviceName];
    return (
        <ul className="sidebar-list busstops-list">
        {stops.stops.map(stop => (
            <li key={stop.sequence}>
            <i className="material-icons">nature_people</i>
            <span className="myanmar">{stop.name_mm}</span>
            </li>
        ))}
        </ul>
    );
  }

  renderStop(stopId) {
    return null;
  }

  render() {
    const { serviceName, stopId } = this.props.params;
    return (
      <div className="container-fluid">
        <div className="row">
          {serviceName && this.renderStopsForService(serviceName)}
          {stopId && this.renderStop(stopId)}
          {!serviceName && !stopId && this.renderServices()}
        </div>
      </div>
    );
  }
}

WebGLMapSidebar.defaultProps = {
};


function mapStateToProps(state) {
  const { map } = state;
  return {
    busServices: map.busServices,
  };
};


export default connect(mapStateToProps)(WebGLMapSidebar);
