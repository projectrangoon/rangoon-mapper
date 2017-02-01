import React from 'react';
import { connect } from 'react-redux';
import { withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import FaSpinner from 'react-icons/lib/fa/spinner';
import _ from 'lodash';

import './index.css';
import { handlePlacesChanged, onMapLoad } from '../../actions/map';
import customMapStyles from '../../constants/CustomMapStyles.json';


const GoogleMapWrapper = _.flowRight(withScriptjs, withGoogleMap)(props => (
    // console.log(props.google);
    // const locationCircle = props.google.maps.Icon({
    //   url: 'https://maps.gstatic.com/mapfiles/transparent.png',
    //   size: props.google.maps.Size(36 / 2, 38 / 2),
    // });
  <GoogleMap
    defaultZoom={props.zoom}
    defaultCenter={props.center}
    defaultOptions={{
      styles: customMapStyles,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
    }}
  >
    {props.markers ?
      (props.markers.map((marker, index, array) =>
        (!index || index === (array.length - 1) ?
          <Marker position={marker} key={index.toString()} /> :
          <Marker position={marker} key={index.toString()} icon="https://maps.gstatic.com/mapfiles/transparent.png" />
      ))) : null}
    {props.markers ?
      (<Polyline
        path={props.markers}
        options={{
          strokeColor: '#86603E',
          strokeOpacity: '0.7',
          strokeWeight: '3',
        }}
      />)
      : null}
  </GoogleMap>
));

const Map = (props) => {
  const { center, zoom, routeMarkers, routePath } = props.map;
  return (
    <GoogleMapWrapper
      googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBePNN11JZSltU-e8ht5z176ZWDKpx5Jg0&libraries=place"
      loadingElement={
        <div style={{ height: '100%' }}>
          <FaSpinner
            style={{
              display: 'block',
              width: '80px',
              height: '80px',
              margin: '150px auto',
              animation: 'fa-spin 2s infinite linear',
            }}
          />
        </div>
      }
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
    onMapLoad: () => {
      dispatch(onMapLoad());
    },
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Map);
