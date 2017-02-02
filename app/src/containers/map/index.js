import React from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';

import './index.css';
import { handlePlacesChanged, onMapLoad } from '../../actions/map';
import customMapStyles from '../../constants/CustomMapStyles.json';
import BusStop from '../../components/BusStop';


const Map = (props) => {
  const { center, zoom, routeMarkers, google } = props.map;
  const mapOptions = {
    styles: customMapStyles,
  };
  if (routeMarkers) {
    const path = new google.maps.Polyline({
      path: routeMarkers,
      strokeColor: '#f00',
      geodesic: true,
      strokeOpacity: 0.7,
      strokeWeight: 3,
      clickable: false,
    });
    path.setMap(google.map);
  }
  return (
    <GoogleMap
      bootstrapURLKeys={{ key: 'AIzaSyBePNN11JZSltU-e8ht5z176ZWDKpx5Jg0' }}
      center={center}
      zoom={zoom}
      options={mapOptions}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={props.onMapLoad}
    >
      {routeMarkers ?
        routeMarkers.map(marker => <BusStop key={marker.bus_stop_id} {...marker} />)
        : null}
    </GoogleMap>
  );
};

Map.propTypes = {
  map: React.PropTypes.object.isRequired,
  onMapLoad: React.PropTypes.func.isRequired,
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
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Map);
