import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';
import _ from 'lodash';

import { handlePlacesChanged, onMapLoad, selectStartEndStop } from '../../actions/map';
import customMapStyles from '../../constants/CustomMapStyles.json';
import Marker from '../../components/Marker';

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
      startStop,
      endStop,
      } = this.props.map;


    return (
      <GoogleMap
        bootstrapURLKeys={{ key: 'AIzaSyBePNN11JZSltU-e8ht5z176ZWDKpx5Jg0' }}
        center={center}
        zoom={zoom}
        options={{ styles: customMapStyles }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={this.props.onMapLoad}
      >
        {routePath && routePath.path && startStop.bus_stop_id !== routePath.path[0].bus_stop_id &&
          <Marker color="#ffffff" midpoint={false} {...startStop} />
        }

        {routePath && routePath.path && routePath.path.map((marker, index) =>
          <Marker
            key={_.uniqueId('marker')}
            color={busServices[marker.service_name].color}
            midpoint={marker.walk || !(index === 0 || index === routePath.path.length - 1)}
            {...marker}
          />)
        }

        {routePath && routePath.path &&
         endStop.bus_stop_id !== routePath.path[routePath.path.length - 1].bus_stop_id &&
         <Marker color="#ffffff" midpoint={false} {...endStop} />
        }

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
