import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
// eslint-disable-next-line
import  * as MapboxGl from 'mapbox-gl/dist/mapbox-gl';
import { MAPBOX_TOKEN } from '../../constants/lib';
// import { map } from 'lodash';

class WebGLMap extends Component {
  constructor(props) {
    super(props);

    const { serviceName } = this.props.params;
    if (serviceName) {
      const busService = this.props.busServices[serviceName];
      const busStops = busService.stops.reduce((acc, stop) =>
        acc.concat([[stop.lng, stop.lat]]), []);
      const bounds = busStops.reduce((bounds, coord) => bounds.extend(coord),
        new MapboxGl.LngLatBounds(busStops[0], busStops[0]));
      this.state = {
        busService,
        busStops,
        bounds,
      };
    }
  }

  onStyleLoad = (map) => {
    map.fitBounds(this.state.bounds, {
      padding: 20,
      easing: t => t - 0.01,
    });
  }

  render() {
    const { center, pitch, zoom, bearing, minZoom } = this.props.map;
    const { busService } = this.state;
    return (
      <ReactMapboxGl
        // eslint-disable-next-line
        style="mapbox://styles/mapbox/dark-v9"
        ref="webglmap"
        accessToken={MAPBOX_TOKEN}
        bearing={bearing}
        center={center}
        minZoom={minZoom}
        zoom={zoom}
        pitch={pitch}
        movingMethod="flyTo"
        containerStyle={{
          height: "100%",
          width: "100%"
        }}
        fitBoundOptions={{ padding: 50, linear: true }}
        onStyleLoad={this.onStyleLoad}
      >
      {busService &&
        <Layer
        type="line"
        id={"line" + this.props.params.serviceName}
        layout={{ "line-join": "round", "line-cap": "round" }}
        paint={{ "line-color": busService.color, "line-width": 3 }}
        >
        <Feature coordinates={this.state.busStops} />
        </Layer>}

      {busService &&
       <Layer
         type="symbol"
         id={"point" + this.props.params.serviceName}
          layout={{
            "icon-image": "bus-11",
          }}
         paint={{ "icon-color": '#ff0000'}}
       >
         {busService.stops.map(stop => <Feature key={stop.sequence} coordinates={[stop.lng, stop.lat]} />)}
       </Layer>
      }


      </ReactMapboxGl>
    );
  }
}

function mapStateToProps(state) {
  const { webglmap, map } = state;
  return {
    busServices: map.busServices,
    map: webglmap,
  };
}

WebGLMap.defaultProps = {
  params: {
    serviceName: null,
  },
};


WebGLMap.propTypes = {
  map: PropTypes.object.isRequired,
  busServices: PropTypes.object.isRequired,
  params: PropTypes.object,
};


export default connect(mapStateToProps)(WebGLMap);
