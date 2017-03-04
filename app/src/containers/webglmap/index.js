import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { MAPBOX_TOKEN } from '../../constants/lib';
import { map } from 'lodash';

class WebGLMap extends Component {
  componentDidMount() {
  }
  render() {
    const { center, pitch, zoom } = this.props.map;
    const { busServices } = this.props;
    return (
      <ReactMapboxGl
        // eslint-disable-next-line
        style="mapbox://styles/mapbox/dark-v9"
        accessToken={MAPBOX_TOKEN}
        center={center}
        zoom={zoom}
        pitch={pitch}
        containerStyle={{
          height: "100%",
          width: "100%"
        }}
      >

      {busServices && map(busServices, (value, key) =>
        <Layer
          key={"line" + key}
          type="symbol"
          id={"line" + key}
          layout={{ "icon-image": "bus-11" }}
        >
        {
          value.stops.map((stop) =>
            <Feature
              key={stop.sequence}
              coordinates={[stop.lng, stop.lat]}
            />
          )
        }
        </Layer>
      )}
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


WebGLMap.propTypes = {
  map: PropTypes.object.isRequired,
  busServices: PropTypes.object.isRequired,
};


export default connect(mapStateToProps)(WebGLMap);
