import types from '../constants/ActionTypes';
import { updateMapCenter, calculateRoute } from './map';

export const loadAllBusStops = (busStops) => {
  return {
    type: types.LOAD_ALL_BUS_STOPS,
    busStops,
  };
};

export const selectStartStop = startStop => ({
  type: types.SELECT_START_STOP,
  startStop,
});

export const selectEndStop = endStop => ({
  type: types.SELECT_END_STOP,
  endStop,
});

export const selectStartEndStop = (startStop, endStop) => {
  return (dispatch, getState) => {
    const { busStops, map } = getState();
    if (startStop) {
      dispatch(selectStartStop(startStop));
      if (busStops.endStop) {
        dispatch(calculateRoute(map.graph, startStop, busStops.endStop));
        const center = { lat: parseFloat(startStop.lat), lng: parseFloat(startStop.lng) };
        dispatch(updateMapCenter(center));
      }
    }
    if (endStop) {
      dispatch(selectEndStop(endStop));
      if (busStops.startStop) {
        dispatch(calculateRoute(map.graph, busStops.startStop, endStop));
        const center = {
          lat: parseFloat(busStops.startStop.lat),
          lng: parseFloat(busStops.startStop.lng),
        };
        dispatch(updateMapCenter(center));
      }
    }
  };
};
