import React from 'react';
import Modal from 'antd/lib/modal';
import { connect } from 'react-redux';

import { hideModal } from '../../actions/modals';
import ModalNames from '../../constants/ModalNames';

const GetMeSomewhereModal = props => (
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

GetMeSomewhereModal.propTypes = {
  modals: React.PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  handleOk: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { modals } = state;
  return {
    modals,
  };
};

const mapDispatchToProps = dispatch => ({
  handleOk: () => {
    dispatch(hideModal());
  },
  handleCancel: () => {
    dispatch(hideModal());
  },
  showGetMeSomewhereModal: () => {
    dispatch(hideModal());
  },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(GetMeSomewhereModal);
