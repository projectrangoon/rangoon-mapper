import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactMapboxGl, { Layer, Feature, Source } from 'react-mapbox-gl';
import turf from '@turf/turf';
import  * as MapboxGl from 'mapbox-gl/dist/mapbox-gl'; // eslint-disable

import { MAPBOX_TOKEN } from './constants';

class WebGLMap extends Component {

  componentWillMount() {
    this.state = {
      busServices: null,
      initialPitch: false,
      bounds: null,
    };
  }

  componentDidMount() {
    // const { serviceName } = this.props.params;
  }

  //constructor(props) {
    //super(props)
    /* super(props);

     * this.state = {
     *   busService: null,
     * };

     * const { serviceName } = this.props.params;
     * if (serviceName) {
     *   const busService = this.props.busServices[serviceName];
     *   const busStopsCoords = busService.stops.reduce((acc, stop) =>
     *     acc.concat([[stop.lng, stop.lat]]), []);
     *   const bounds = busStopsCoords.reduce((bounds, coord) => bounds.extend(coord),
     *     new MapboxGl.LngLatBounds(busStopsCoords[0], busStopsCoords[0]));

     *   const path = turf.lineString(busStopsCoords);
     *   const pathLength = turf.lineDistance(path, 'kilometers');
     *   const point = turf.along(path, 0, 'kilometers');

     *   const pathSource = {
     *     type: 'geojson',
     *     data: path,
     *     maxzoom: 20,
     *   };

     *   const pointSource = {
     *     type: 'geojson',
     *     data: point,
     *     maxzoom: 20,
     *   };

     *   this.state = {
     *     busService,
     *     busStopsCoords,
     *     bounds,
     *     path,
     *     pathLength,
     *     point,
     *     pathSource,
     *     pointSource,
     *     initialPitch: false,
     *   };
     * }*/
//  }

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

  onStyleLoad = (source, busServiceData) => {
    // map.fitBounds(this.state.bounds, { padding: 10 });

    const { busService, pathLength, path } = busServiceData

    let step = 0;
    let numSteps = 1200; // animation resolution
    const pSource = source.map.getSource('pointSource' + busService.service_no);
    const animateRoute = _ => {
      step += 1;
      if (step > numSteps) {
        step = 0;
      } else {
        const currDistance = step / numSteps * pathLength;
        const point = turf.along(path, currDistance, 'kilometers');
        pSource.setData(point);
      }
      requestAnimationFrame(animateRoute);
    }
    animateRoute();
  }

  onMoveEnd = (map) => {
    if (!this.state.initialPitch && this.props.busServices) {
      map.easeTo({ pitch: 50, duration: 3000 });
      this.setState({ initialPitch: true, afterPitchZoom: map.getZoom() });
    }
  }

  onPointSourceAdded = (source, busServiceData) => {
    this.onStyleLoad(source, busServiceData);
  }

  renderLayers(busServiceData, key) {
    const { busService, pointSource, busStopsCoords } = busServiceData;

    const sourceId = "pointSource" + busService.service_no;

    return (
      <span key={busService.service_no}>
        <Layer
          id={"buslinelayer" + busService.service_no}
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
          <Feature coordinates={busStopsCoords} />
          {/* <Feature
              onHover={this.onBusRouteHover}
              onEndHover={this.onEndBusRouteHover}
              coordinates={busStopsCoords}
              /> */}
        </Layer>

      {/* <Layer
       *   type="symbol"
       *   id={"busstopslayer" + busService.service_no}
       *   layout={{
       *     "icon-image": "bus-11",
       *   }}
       *   paint={{ "icon-color": '#ff0000'}}
       * >
       *   {busService.stops.map(stop => <Feature
       *                                   key={stop.sequence}
       *                                   coordinates={[stop.lng, stop.lat]} />)}
       * </Layer>*/}

        <Source
          id={sourceId}
          geoJsonSource={pointSource}
          onSourceAdded={source => this.onPointSourceAdded(source, busServiceData)}
        />
        <Layer
          id={"pointLayer" + busService.service_no}
          sourceId={sourceId}
          type="circle"
          paint={{
            'circle-radius': 4,
            'circle-color': '#ffffff'
          }}
        />
        </span>
    );
  }

  getBusServicesInfo(selectedBusServices) {
    const busServices = selectedBusServices.reduce((acc, serviceName) => {
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

      return acc.concat([
        {busService, busStopsCoords, bounds, path, pathLength, point, pathSource, pointSource}
      ]);
    }, []);

    return busServices;
  }

  render() {
    const { center, zoom, bearing, minZoom } = this.props.map;
    const { selectedBusServices } = this.props.sidebar;
    let busServices = null;
    if (selectedBusServices.length > 0) {
      busServices = this.getBusServicesInfo(selectedBusServices);
    }

    console.log(selectedBusServices.length, busServices);

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

        { selectedBusServices && busServices && busServices.map(service => this.renderLayers(service))}

      </ReactMapboxGl>
    );
  }
}

function mapStateToProps(state) {
  const { webglmap, map, busServicesSidebar } = state;
  return {
    busServices: map.busServices,
    map: webglmap,
    sidebar: busServicesSidebar,
  };
}

WebGLMap.defaultProps = {
  params: {
    serviceName: null,
  },
  busServiceNo: null,
  sidebar: null,
};


WebGLMap.propTypes = {
  map: PropTypes.object.isRequired,
  busServices: PropTypes.object.isRequired,
  params: PropTypes.object,
  busServiceNo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  sidebar: PropTypes.object,
};


export default connect(mapStateToProps)(WebGLMap);
