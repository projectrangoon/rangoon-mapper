import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { MAPBOX_TOKEN } from '../../constants/lib';
// import { map } from 'lodash';

class WebGLMap extends Component {
  constructor() {
    super();
    this.state = {
      busService: null,
      busStops: null,
    };
  }
  componentDidMount() {
    const { serviceName } = this.props.params;
    if (serviceName) {
      const busService = this.props.busServices[serviceName];
      const busStops = busService.stops.reduce((acc, stop) =>
        acc.concat([[stop.lng, stop.lat]]) , []);
      this.setState({
        busService,
        busStops,
      });
    }
  }
  render() {
    const { center, pitch, zoom, bearing, minZoom } = this.props.map;
    const { busService } = this.state;
    return (
      <ReactMapboxGl
        // eslint-disable-next-line
        style="mapbox://styles/mapbox/dark-v9"
        accessToken={MAPBOX_TOKEN}
        bearing={bearing}
        center={center}
        minZoom={minZoom}
        zoom={zoom}
        pitch={pitch}
        containerStyle={{
          height: "100%",
          width: "100%"
        }}
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
         {busService.stops.map(stop => <Feature coordinates={[stop.lng, stop.lat]} />)}
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
