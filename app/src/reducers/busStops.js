import types from '../constants/ActionTypes';

const INITIAL_STATE = {
  data: null,
};

export default function modal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOAD_ALL_BUS_STOPS: {
      return Object.assign({}, state, {
        data: action.busStops,
      });
    }
    default:
      return state;
  }
}
