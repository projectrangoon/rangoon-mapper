import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MapGL from 'react-map-gl';
import { onChangeViewport } from 'redux-map-gl';

const token = 'pk.eyJ1Ijoia2h6YXciLCJhIjoiN3liaDByOCJ9.nMTO6Nz-aAibwaN9ydIXYg';

class WebGLMap extends Component {
  render() {
    const { viewport, onChangeViewport } = this.props;
    const { busServices } = this.props.busServices;
    return (
      <MapGL
        {...viewport}
        width={window.innerWidth}
        height={window.innerHeight}
        perspectiveEnabled
        mapboxApiAccessToken={token}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onChangeViewport={onChangeViewport}
      />
    );
  }
}

function mapStateToProps(state) {
  const { webglmap, map } = state;
  return {
    viewport: webglmap.viewport.toJS(),
    map: webglmap,
    busServices: map.busServices,
  };
}

const actions = {
  onChangeViewport,
};


WebGLMap.propTypes = {
  viewport: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired,
  busServices: PropTypes.object.isRequired,
};


export default connect(mapStateToProps, actions)(WebGLMap);
