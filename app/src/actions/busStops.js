import types from '../constants/ActionTypes';
import { updateMapCenter, calculateRoute } from './map';

export const loadAllBusStops = busStops => ({
  type: types.LOAD_ALL_BUS_STOPS,
  busStops,
});

export const selectStartStop = startStop => ({
  type: types.SELECT_START_STOP,
  startStop,
});

export const selectEndStop = endStop => ({
  type: types.SELECT_END_STOP,
  endStop,
});

export const selectStartEndStop = (start, end) =>
  (dispatch, getState) => {
    const {
      map,
      busStops,
    } = getState();


    const {
      startStop,
      endStop,
    } = busStops;

    if (!startStop && start) {
      dispatch(selectStartStop(start));
    }

    if (!endStop && end) {
      dispatch(selectEndStop(end));
    }

    if ((startStop && end) || (start && endStop)) {
      const origin = start || startStop;
      const destination = end || endStop;
      dispatch(calculateRoute(map.graph, origin, destination));
      const center = {
        lat: parseFloat(origin.lat),
        lng: parseFloat(destination.lng),
      };
      dispatch(updateMapCenter(center));
    }
  };
