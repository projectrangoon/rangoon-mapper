import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';
import _ from 'lodash';

import { loadMap, selectStartEndStop } from '../../actions/map';
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
        onGoogleApiLoaded={this.props.loadMap}
      >
        {routePath && routePath.path && startStop.bus_stop_id !== routePath.path[0].bus_stop_id &&
          <Marker color="#6c62a5" midpoint={false} {...startStop} />
        }

        {routePath && routePath.path && routePath.path.map((marker, index) =>
          <Marker
            key={_.uniqueId('marker')}
            color={marker.color}
            midpoint={marker.walk || !(index === 0 || index === routePath.path.length - 1)}
            {...marker}
          />)}

        {routePath && routePath.path &&
         endStop.bus_stop_id !== routePath.path[routePath.path.length - 1].bus_stop_id &&
         <Marker color="#6c62a5" midpoint={false} {...endStop} />
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
  loadMap: React.PropTypes.func.isRequired,
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
    loadMap: (google) => {
      dispatch(loadMap(google));
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
