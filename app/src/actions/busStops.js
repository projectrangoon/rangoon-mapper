import types  from '../constants/ActionTypes';
import { updateMapCenter, calculateRoute } from './map';

export const loadAllBusStops = (bus_stops) => {
  return {
    type: types.LOAD_ALL_BUS_STOPS,
    bus_stops
  }
}

export const selectStartStop = (start_stop) => {
  return {
    type: types.SELECT_START_STOP,
    start_stop
  }
}

export const selectEndStop = (end_stop) => {
  return {
    type: types.SELECT_END_STOP,
    end_stop
  }
}

export const selectStartEndStop = (start_stop, end_stop) => {
  return function(dispatch, getState) {
    const { busStops } = getState();
    if (start_stop) {
      dispatch(selectStartStop(start_stop));
      if (busStops.end_stop) {
        dispatch(calculateRoute(start_stop, busStops.end_stop));
        const center = {lat: parseFloat(start_stop.lat), lng: parseFloat(start_stop.lng)}
        dispatch(updateMapCenter(center));
      }
    }
    if (end_stop) {
      dispatch(selectEndStop(end_stop));
      if (busStops.start_stop) {
        dispatch(calculateRoute(busStops.start_stop, end_stop));
        const center = {lat: parseFloat(busStops.start_stop.lat), lng: parseFloat(busStops.start_stop.lng)};
        dispatch(updateMapCenter(center));
      }
    }
  }
}
