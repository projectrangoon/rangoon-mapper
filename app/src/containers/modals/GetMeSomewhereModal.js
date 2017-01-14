import React from 'react';
import Modal from 'antd/lib/modal';
import { connect } from 'react-redux';

import { hideModal } from '../../actions/modals';
import ModalNames from '../../constants/ModalNames';

const GetMeSomewhereModal = (props) => (
    <Modal 
        title="Get Me Somewhere" 
        visible={props.modals.name === ModalNames.GET_ME_SOMEWHERE}
        onOk={props.handleOk} 
        onCancel={props.handleCancel}
        footer={null}
    >
          <h1>Working on the algorithm</h1>
    </Modal>
);

const mapStateToProps = (state) => {
  const { modals } = state

  return {
    modals,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleOk: () => {
        dispatch(hideModal());
    },
    handleCancel: () => {
        dispatch(hideModal());
    },
    showGetMeSomewhereModal: () => {
        dispatch(hideModal());
    }
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GetMeSomewhereModal);

                // <AutoCompleteSearch
                //     name="start"
                //     className="SearchInput"
                //     placeholder="Start"
                //     onPlacesChanged={this.props.handlePlacesChanged}
                // />