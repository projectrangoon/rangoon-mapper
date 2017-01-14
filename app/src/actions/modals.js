import types from '../constants/ActionTypes'

export const showModal = (name, data) => {
  return {
    type: types.MODAL_SHOW,
    payload: {
      name,
      data
    }
  }
}

export const hideModal = () => {
  return {
    type: types.MODAL_HIDE
  }
}
