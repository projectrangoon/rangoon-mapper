import { Component, PropTypes } from 'react';

class Polyline extends Component {
  componentWillMount() {
    if (this.props.google) {
      const polyline = new this.props.google.maps.Polyline({
        map: this.props.google.map,
        geodesic: true,
        strokeColor: this.props.color,
        strokeOpacity: 0.7,
        strokeWeight: 3,
        clickable: false,
        path: this.props.routePath,
      });
      this.setState({ polyline });
    }
  }
  componentWillUnmount() {
    if (this.state && this.state.polyline) {
      this.state.polyline.setMap(null);
    }
  }
  render() {
    return false;
  }
}

Polyline.defaultProps = {
  google: null,
  routePath: null,
  color: '',
};

Polyline.propTypes = {
  google: PropTypes.any,
  routePath: PropTypes.any,
  color: PropTypes.string,
};

export default Polyline;
