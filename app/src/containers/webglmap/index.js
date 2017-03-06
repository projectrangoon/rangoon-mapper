import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactMapboxGl, { Layer, Feature, Source } from 'react-mapbox-gl';
import  * as MapboxGl from 'mapbox-gl/dist/mapbox-gl'; // eslint-disable
import { MAPBOX_TOKEN } from '../../constants/lib';
import turf from '@turf/turf';

class WebGLMap extends Component {
  constructor(props) {
    super(props);

    const { serviceName } = this.props.params;
    if (serviceName) {
      const busService = this.props.busServices[serviceName];
      const busStopsCoords = busService.stops.reduce((acc, stop) =>
        acc.concat([[stop.lng, stop.lat]]), []);
      const bounds = busStopsCoords.reduce((bounds, coord) => bounds.extend(coord),
        new MapboxGl.LngLatBounds(busStopsCoords[0], busStopsCoords[0]));

      const path = turf.lineString(busStopsCoords);
      const pathLength = turf.lineDistance(path, 'kilometers');
      const point = turf.along(path, 0, 'kilometers');

      this.state = {
        busService,
        busStopsCoords,
        bounds,
        path,
        pathLength,
        point,
      };
    }
  }

  onStyleLoad = (map) => {
    map.fitBounds(this.state.bounds, { padding: 10 });

    // wait for map to finish loading, ridiculous I know
    setTimeout(_ => {

      map.flyTo({ pitch: 50, duration: 3000 });
      let step = 0;
      let numSteps = 1000; // animation resolution
      let timePerStep = 30;
      const pSource = map.getSource('point');
      setInterval(_ => {
        step += 1;
        if (step > numSteps) {
          step = 0;
        } else {
          const curDistance = (step / numSteps) * this.state.pathLength;
          const point = turf.along(this.state.path, curDistance, 'kilometers');
          pSource.setData(point);
        }
      }, timePerStep);
    }, 2500);
  }

  renderLayers(busService, path, point) {

    const pathSource = {
      type: 'geojson',
      data: path,
      maxzoom: 20,
    };
    const pointSource = {
      type: 'geojson',
      data: point,
      maxzoom: 20,
    };

    return (
      <span>
        <Source id="path" geoJsonSource={pathSource} />
        <Layer
          id="pathLayer"
          sourceId="path"
          type="line"
          layout={{
            'line-join': 'round',
            'line-cap': 'round',
          }}
          paint={{
            'line-color': busService.color,
            'line-width': 3
          }}
        >
        </Layer>

        <Layer
          type="symbol"
          id={"symbol" + this.props.params.serviceName}
          layout={{
            "icon-image": "bus-11",
          }}
          paint={{ "icon-color": '#ff0000'}}
        >
          {busService.stops.map(stop => <Feature key={stop.sequence} coordinates={[stop.lng, stop.lat]} />)}
        </Layer>


        <Source id="point" geoJsonSource={pointSource} />
        <Layer
          id="pointLayer"
          sourceId="point"
          type="circle"
          layout={{
          }}
          paint={{
            'circle-radius': 4,
            'circle-color': '#ffffff'
          }}
        >
        </Layer>
      </span>
    );
  }

  render() {
    const { center, zoom, bearing, minZoom } = this.props.map;
    const { busService, path, point } = this.state;

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
        movingMethod="flyTo"
        containerStyle={{
          height: "100%",
          width: "100%"
        }}
        onStyleLoad={this.onStyleLoad}
      >
        { this.renderLayers(busService, path, point) }

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
