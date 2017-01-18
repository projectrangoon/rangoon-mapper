import types  from '../constants/ActionTypes';
import { calculateRoute } from './map';

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

export const selectEndStopAndCalculateRoute = (end_stop) => {
  return function(dispatch, getState) {
    const { busStops } = getState();
    dispatch(selectEndStop(end_stop));
    dispatch(calculateRoute(busStops.start_stop, busStops.end_stop));
  }
}