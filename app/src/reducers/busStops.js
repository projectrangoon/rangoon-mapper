import types from '../constants/ActionTypes';

const INITIAL_STATE = {
  data: null,
  startStop: null,
  endStop: null,
};

export default function modal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOAD_ALL_BUS_STOPS: {
      return Object.assign({}, state, {
        data: action.busStops,
      });
    }
    case types.SELECT_START_STOP: {
      return Object.assign({}, state, {
        startStop: action.startStop,
      });
    }
    case types.SELECT_END_STOP: {
      return Object.assign({}, state, {
        endStop: action.endStop,
      });
    }
    default:
      return state;
  }
}
