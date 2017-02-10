import React from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';

import './index.css';
import { handlePlacesChanged, onMapLoad } from '../../actions/map';
import customMapStyles from '../../constants/CustomMapStyles.json';
import BusStop from '../../components/BusStop';
import Polyline from '../../components/Polyline';
import allBusStops from '../../../../experiment/unique_stops.json';


const Map = (props) => {
  const {
    center,
    zoom,
    routePath,
    google } = props.map;


  return (
    <GoogleMap
      bootstrapURLKeys={{ key: 'AIzaSyBePNN11JZSltU-e8ht5z176ZWDKpx5Jg0' }}
      center={center}
      zoom={zoom}
      options={{ styles: customMapStyles }}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={props.onMapLoad}
    >

      {routePath && routePath.path ?
        <Polyline google={google} routePath={routePath} />
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

function mapStateToProps(state, ownProps) {
  let { map } = state;

  if (ownProps.routeParams) {
    map = {
      ...map,
      startStop: allBusStops[ownProps.routeParams.startStop],
      endStop: allBusStops[ownProps.routeParams.endStop],
    };
  }

  return {
    map,
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
