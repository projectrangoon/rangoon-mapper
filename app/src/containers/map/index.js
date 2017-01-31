import React from 'react';
import { connect } from 'react-redux';
import { withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps';

import './index.css';
import { handlePlacesChanged } from '../../actions/map';
import customMapStyles from '../../constants/CustomMapStyles.json';

const GoogleMapWrapper = withGoogleMap(props => (
  <GoogleMap
    zoom={props.zoom}
    center={props.center}
    options={{
      styles: customMapStyles,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
    }}
  >
    {props.markers ? (props.markers.map((marker, index) =>
      (<Marker position={marker} key={index.toString()} />))) : (null)}
    {props.markers ? (<Polyline path={props.markers} />) : null}
  </GoogleMap>
));

const Map = (props) => {
  const { center, zoom, routeMarkers, routePath } = props.map;
  return (
    <GoogleMapWrapper
      containerElement={
        <div style={{ height: '100%' }} />
      }
      mapElement={
        <div style={{ height: '100%' }} />
      }
      zoom={zoom}
      center={center}
      markers={routeMarkers}
      path={routePath}
    />
  );
};

Map.propTypes = {
  map: React.PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
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
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Map);
