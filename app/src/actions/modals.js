import types from '../constants/ActionTypes'

export const showModal = (name, data) => ({
  type: types.MODAL_SHOW,
  payload: {
    name,
    data,
  },
});

export const hideModal = () => ({
  type: types.MODAL_HIDE,
});
