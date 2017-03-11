import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactMapboxGl, { Layer, Feature, Source, Popup } from 'react-mapbox-gl';
import turf from '@turf/turf';
import  * as MapboxGl from 'mapbox-gl/dist/mapbox-gl'; // eslint-disable

import { MAPBOX_TOKEN } from './constants';

class WebGLMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      busService: null,
    };

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

      this.state = {
        busService,
        busStopsCoords,
        bounds,
        path,
        pathLength,
        point,
        pathSource,
        pointSource,
        initialPitch: false,
      };
    }
  }

  onBusStopHover = (args) => {
  }

  onEndBusStopHover = (args) => {
  }

  onBusRouteHover = (args) => {
    args.map.setPaintProperty('pathLayer', 'line-width', 7);
  }

  onEndBusRouteHover = (args) => {
    args.map.setPaintProperty('pathLayer', 'line-width', 3);
  }

  onStyleLoad = (map) => {
    map.fitBounds(this.state.bounds, { padding: 10 });

    let step = 0;
    let numSteps = 1200; // animation resolution
    const pSource = map.getSource('point');
    const animateRoute = _ => {
      step += 1;
      if (step > numSteps) {
        step = 0;
      } else {
        const currDistance = step / numSteps * this.state.pathLength;
        const point = turf.along(this.state.path, currDistance, 'kilometers');
        pSource.setData(point);
      }
      requestAnimationFrame(animateRoute);
    }
    animateRoute();
  }

  onMoveEnd = (map) => {
    if (!this.state.initialPitch && this.state.busService) {
      map.easeTo({ pitch: 50, duration: 3000 });
      this.setState({ initialPitch: true, afterPitchZoom: map.getZoom() });
    }
  }

  onPointSourceAdded = (source) => {
    this.onStyleLoad(source.map);
  }

  renderLayers(busService, path, point) {
    const { pointSource, busStopsCoords } = this.state;

    return (
      <span>
        <Layer
          id="pathLayer"
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
          <Feature
            onHover={this.onBusRouteHover}
            onEndHover={this.onEndBusRouteHover}
            coordinates={busStopsCoords}
          />
        </Layer>

        <Layer
          type="symbol"
          id={"busstops" + this.props.params.serviceName}
          layout={{
            "icon-image": "bus-11",
          }}
          paint={{ "icon-color": '#ff0000'}}
        >
          {busService.stops.map(stop => <Feature
                                          key={stop.sequence}
                                          onHover={this.onBusStopHover}
                                          onEndHover={this.onEndBusStopHover}
                                          coordinates={[stop.lng, stop.lat]} />)}
        </Layer>

        <Popup
          coordinates={[busService.stops[0].lng, busService.stops[0].lat]}
          className="popup start"
          offset={{
            'bottom': [0, -20]
          }}
        >
          <div className="myanmar popup-content" style={{backgroundColor: busService.color }}>ဂိတ်စ</div>
        </Popup>

        <Popup
          coordinates={[busService.stops[busService.stops.length - 1].lng, busService.stops[busService.stops.length - 1].lat]}
          className="popup end"
          offset={{'bottom': [0, -20] }}
        >
          <div className="myanmar popup-content" style={{ backgroundColor: busService.color }}>ဂိတ်ဆုံး</div>
        </Popup>

        <Source
          id="point"
          geoJsonSource={pointSource}
          onSourceAdded={this.onPointSourceAdded}
        />
        <Layer
          id="pointLayer"
          sourceId="point"
          type="circle"
          paint={{
            'circle-radius': 4,
            'circle-color': '#ffffff'
          }}
        />
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
        accessToken={MAPBOX_TOKEN}
        bearing={bearing}
        center={center}
        minZoom={minZoom}
        zoom={zoom}
        movingMethod="easeTo"
        containerStyle={{
          height: "100%",
          width: "100%"
        }}
        onMoveEnd={this.onMoveEnd}
      >
        { busService && this.renderLayers(busService, path, point) }

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
  busServiceNo: null,
};


WebGLMap.propTypes = {
  map: PropTypes.object.isRequired,
  busServices: PropTypes.object.isRequired,
  params: PropTypes.object,
  busServiceNo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};


export default connect(mapStateToProps)(WebGLMap);
