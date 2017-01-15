import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css'

import { loadAllBusStops, selectStartStop, selectEndStop } from '../../actions/busStops';
import { updateMapCenter } from '../../actions/map';
import AutoCompleteSearch from '../../components/AutoCompleteSearch';
// const busServicesJson = require('../../../../experiment/bus_services.json');
const busStops = require('../../../../experiment/bus_stops.json');

class Sidebar extends Component {
    componentWillMount() {
        this.props.loadAllBusStops();
    }

    resultRenderer(props) {
        console.log(props);
    }

    render() {
        return (
            <aside id="Sidebar">
                <AutoCompleteSearch
                    source={busStops}
                    placeholder="Start"
                    onSelect={this.props.handleStartStopSelect}
                />
                <AutoCompleteSearch
                    source={busStops}
                    placeholder="End"
                    onSelect={this.props.handleEndStopSelect}
                />
            </aside>
        );
    }
}

function mapStateToProps(state) {
  const { bus_stops } = state;

  return {
    bus_stops,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadAllBusStops: () => {
        dispatch(loadAllBusStops(busStops));
    },
    handleStartStopSelect: (bus_stop) => {
        dispatch(selectStartStop(bus_stop));
        const center = {lat: parseFloat(bus_stop.lat), lng: parseFloat(bus_stop.lng)};
        dispatch(updateMapCenter(center));
    },
    handleEndStopSelect: (bus_stop) => {
        dispatch(selectEndStop(bus_stop));
        const center = {lat: parseFloat(bus_stop.lat), lng: parseFloat(bus_stop.lng)};
        dispatch(updateMapCenter(center));
    },
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar)
