import React from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';

import './index.css';
import { handlePlacesChanged, onMapLoad } from '../../actions/map';
import customMapStyles from '../../constants/CustomMapStyles.json';
import BusStop from '../../components/BusStop';


const Map = (props) => {
  const { center, zoom, routeMarkers } = props.map;
  const mapOptions = {
    styles: customMapStyles,
  };
  return (
    <GoogleMap
      apiKey="AIzaSyBePNN11JZSltU-e8ht5z176ZWDKpx5Jg0"
      center={center}
      zoom={zoom}
      options={mapOptions}
    >
      {routeMarkers ?
        routeMarkers.map((marker, index) =>
          <BusStop lat={marker.lat} lng={marker.lng} text={index + 1} />)
        : null}
    </GoogleMap>
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
