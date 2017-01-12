import React, { PropTypes, Component } from 'react';
import GoogleMap from 'google-map-react';

// import MyGreatPlace from './my_great_place';
import './index.css';

class Map extends Component {
    static propTypes = {
        center: PropTypes.array,
        zoom: PropTypes.number,
    };

    static defaultProps = {
        center: {lat: 1.290270, lng: 103.851959},
        zoom: 11,
    };

    render() {
        return (
            <section id="Map">
                <GoogleMap
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}>
                </GoogleMap>
            </section>
        )
    }
}

export default Map;
