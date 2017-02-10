import React from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';
import _ from 'lodash';

import './index.css';
import { handlePlacesChanged, onMapLoad } from '../../actions/map';
import customMapStyles from '../../constants/CustomMapStyles.json';
import BusStop from '../../components/BusStop';
import Polyline from '../../components/Polyline';


const Map = (props) => {
  const {
    center,
    zoom,
    busServices,
    routePath,
    google } = props.map;


  let polylines = null;

  if (routePath && routePath.path) {
    polylines = _.groupBy(routePath.path || [], 'service_name');
  }


  return (
    <GoogleMap
      bootstrapURLKeys={{ key: 'AIzaSyBePNN11JZSltU-e8ht5z176ZWDKpx5Jg0' }}
      center={center}
      zoom={zoom}
      options={{ styles: customMapStyles }}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={props.onMapLoad}
    >


      {polylines ?
        _.map(polylines, (value, key) => <Polyline key={key} google={google} color={key === '0' ? '#000' : busServices[key].color} routePath={value} />)
      : null}


      {routePath && routePath.path ?
        routePath.path.map(marker => <BusStop key={marker.bus_stop_id} {...marker} />)
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
