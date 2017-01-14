import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';
import Button from 'antd/lib/button';

import './index.css';
import { handlePlacesChanged } from '../../actions/map';
import { showModal } from '../../actions/modals';
import ModalNames from '../../constants/ModalNames';
// import AutoCompleteSearch from '../../components/AutoCompleteSearch';

class Map extends Component {
    render() {
        const { center, zoom } = this.props.map
        return (
            <section id="Map">
                <GoogleMap
                    center={center}
                    zoom={zoom}
                />
                <Button onClick={this.props.showGetMeSomewhereModal} className="MapBtn" type="primary" shape="circle" icon="search"></Button>
            </section>
        )
    }
}

function mapStateToProps(state) {
  const { map } = state

  return {
    map,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handlePlacesChanged: (places) => {
        dispatch(handlePlacesChanged(places));
    },
    showGetMeSomewhereModal: () => {
        dispatch(showModal(ModalNames.GET_ME_SOMEWHERE));
    }
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);
