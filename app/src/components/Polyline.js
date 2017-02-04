import { React, Component } from 'react';

export default class Polyline extends Component {
  constructor(props) {
    super(props);
    if (this.props.google) {
      const polyline = new this.props.google.maps.Polyline({
        map: this.props.google.map,
        geodesic: true,
        strokeColor: this.props.color,
        strokeOpacity: 0.7,
        strokeWeight: 3,
        clickable: false,
        path: this.props.routePath.path,
      });
      this.setState({ polyline });
    }
  }
  componentWillUnmount() {
    if (this.state.polyline) {
      this.state.polyline.setMap(null);
    }
  }
  resetComponent() {
    this.state.path.setMap(this.props.google.map);
  }
  render() {
    return false;
  }
}
Polyline.defaultProps = {
  google: null,
  routePath: null,
};
