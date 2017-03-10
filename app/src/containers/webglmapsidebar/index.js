import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from  'lodash';
import BusServiceListItem from '../../components/BusListItem';
import { selectBusService } from '../../actions/webglmap';


class WebGLMapSidebar extends Component {

  renderServices() {
    const services = this.props.busServices;
    return (
        <ul className="sidebar-list services-list">
          {map(services, (service, key) =>
            <BusServiceListItem key={key} serviceNo={key} onClick={e => this.props.selectBusService(e, service, key)} {...service} /> )}
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
  selectBusService: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { map } = state;
  return {
    busServices: map.busServices,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    selectBusService: (e, busService, busServiceNo) => dispatch(selectBusService(e, busService, busServiceNo)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(WebGLMapSidebar);
