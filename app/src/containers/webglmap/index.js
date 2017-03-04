import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MapGL from 'react-map-gl';

const token = 'pk.eyJ1Ijoia2h6YXciLCJhIjoiN3liaDByOCJ9.nMTO6Nz-aAibwaN9ydIXYg';

class WebGLMap extends Component {
  render() {
    const { latitude, longitude, zoom, bearing, pitch } = this.props.map;
    const { busServices } = this.props.busServices;
    return (
      <MapGL
        longitude={longitude}
        latitude={latitude}
        zoom={zoom}
        bearing={bearing}
        pitch={pitch}
        width={window.innerWidth}
        height={window.innerHeight}
        perspectiveEnabled
        mapboxApiAccessToken={token}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onChangeViewport={(viewport) => {
          console.log(viewport);
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  const { webglmap, map } = state;
  return {
    map: webglmap,
    busServices: map.busServices,
  };
}


WebGLMap.propTypes = {
  map: PropTypes.object.isRequired,
  busServices: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(WebGLMap);
