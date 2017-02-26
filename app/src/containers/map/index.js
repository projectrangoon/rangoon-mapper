import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';
import _ from 'lodash';

import { handlePlacesChanged, onMapLoad, selectStartEndStop } from '../../actions/map';
import customMapStyles from '../../constants/CustomMapStyles.json';
import Marker from '../../components/Marker';
import Polyline from '../../components/Polyline';

class Map extends Component {
  componentDidMount() {
    const { startStop, endStop } = this.props.params; // URL params
    const { busStopsMap } = this.props.map;
    if (startStop || endStop) {
      this.props.selectStartEndStop(busStopsMap[startStop], busStopsMap[endStop]);
    }
  }
  render() {
    const {
      center,
      zoom,
      busServices,
      routePath,
      polylines,
      google } = this.props.map;


    return (
      <GoogleMap
        bootstrapURLKeys={{ key: 'AIzaSyBePNN11JZSltU-e8ht5z176ZWDKpx5Jg0' }}
        center={center}
        zoom={zoom}
        options={{ styles: customMapStyles }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={this.props.onMapLoad}
      >

        {routePath && routePath.path ?
         routePath.path.map((marker, index) =>
           <Marker
             key={marker.bus_stop_id}
             color={busServices[marker.service_name].color} {...marker}
             midpoint={!(index === 0 || index === (routePath.path.length - 1))}
           />)
          : null}

        {polylines && google ?
         _.map(polylines, (value, key) =>
           <Polyline
             key={key}
             google={google}
             color={busServices[key].color}
             routePath={value}
           />)
        : null}

      </GoogleMap>
    );
  }
}

Map.defaultProps = {
  params: {
    startStop: null,
    endStop: null,
  },
};

Map.propTypes = {
  map: React.PropTypes.object.isRequired,
  onMapLoad: React.PropTypes.func.isRequired,
  selectStartEndStop: React.PropTypes.func.isRequired,
  params: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { map, busStops } = state;

  return {
    map,
    busStops,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handlePlacesChanged: (places) => {
      dispatch(handlePlacesChanged(places));
    },
    onMapLoad: (google) => {
      dispatch(onMapLoad(google));
    },
    selectStartEndStop: (startStop, endStop) => {
      dispatch(selectStartEndStop(startStop, endStop));
    },
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Map);
