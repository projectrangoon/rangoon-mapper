import types  from '../constants/ActionTypes';

export const loadAllBusStops = (bus_stops) => {
  return {
    type: types.LOAD_ALL_BUS_STOPS,
    bus_stops
  }
}

export const selectStartStop = (bus_stop) => {
  return {
    type: types.SELECT_START_STOP,
    bus_stop
  }
}

export const selectEndStop = (bus_stop) => {
  return {
    type: types.SELECT_END_STOP,
    bus_stop
  }
}