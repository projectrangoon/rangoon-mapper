import types from '../constants/ActionTypes';

const INITIAL_STATE = {
  isFetching: false,
  data: null,
};

export default function modal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOAD_ALL_BUS_SERVICES: {
      return Object.assign({}, state, {
        isFetching: true,
      });
    }
    default:
      return state;
  }
}
