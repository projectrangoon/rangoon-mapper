import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MapGL, { ScatterplotOverlay } from 'react-map-gl';
import { onChangeViewport } from 'redux-map-gl';
import { MAPBOX_TOKEN } from '../../constants/lib';

class WebGLMap extends Component {
  componentDidMount() {
  }
  render() {
    const { viewport, changeViewport } = this.props;
    const { busServices } = this.props.busServices;
    return (
      <MapGL
        {...viewport}
        width={window.innerWidth}
        height={window.innerHeight}
        perspectiveEnabled
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onChangeViewport={changeViewport}
      >
        {busServices &&
        <ScatterplotOverlay
          {...viewport}
          width={window.innerWidth}
          height={window.innerHeight}
          locations={busServices}
          dotRadius={4}
          globalOpacity={1}
          compositeOperation="screen"
        />}
      </MapGL>
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
  changeViewport: onChangeViewport,
};


WebGLMap.propTypes = {
  viewport: PropTypes.object.isRequired,
  busServices: PropTypes.object.isRequired,
  changeViewport: PropTypes.func.isRequired,
};


export default connect(mapStateToProps, actions)(WebGLMap);
