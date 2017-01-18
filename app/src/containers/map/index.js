import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';

import './index.css';
import Marker from '../../components/Marker';
import { handlePlacesChanged } from '../../actions/map';
import { showModal } from '../../actions/modals';
import ModalNames from '../../constants/ModalNames';
import customMapStyles from '../../constants/CustomMapStyles.json';
// import AutoCompleteSearch from '../../components/AutoCompleteSearch';


class Map extends Component {
    render() {
        const { center, zoom } = this.props.map
        const { start_stop, end_stop } = this.props.busStops
        return (
            <section id="Map">
                <GoogleMap center={center} zoom={zoom} options={{styles: customMapStyles}} >
                    {start_stop ? (
                        <Marker lat={start_stop.lat} lng={start_stop.lng} text="Start" />
                    ) : (
                        null
                    )}
                    {end_stop ? (
                        <Marker lat={end_stop.lat} lng={end_stop.lng} text="End" />
                    ) : (
                        null
                    )}
                </GoogleMap>
            </section>
        )
    }
}

function mapStateToProps(state) {
  const { map, busStops } = state

  return {
    map,
    busStops
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handlePlacesChanged: (places) => {
        dispatch(handlePlacesChanged(places));
    },
    showGetMeSomewhereModal: () => {
        dispatch(showModal(ModalNames.GET_ME_SOMEWHERE));
    },
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);
