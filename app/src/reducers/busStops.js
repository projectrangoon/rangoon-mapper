import types from '../constants/ActionTypes';

const INITIAL_STATE = {
    data: null,
    start_stop: null,
    end_stop: null
};

export default function modal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOAD_ALL_BUS_STOPS:
        return Object.assign({}, state, {
            data: action.bus_stops
        })
    case types.SELECT_START_STOP:
      return Object.assign({}, state, {
          start_stop: action.bus_stop,
      })
    case types.SELECT_END_STOP:
      return Object.assign({}, state, {
          end_stop: action.bus_stop,
      })
    default:
      return state;
  }
}
