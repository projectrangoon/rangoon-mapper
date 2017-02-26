import { push } from 'react-router-redux';
import types from '../constants/ActionTypes';
import { calculateRoute as calculateRouteAction } from '../utils';

export const handlePlacesChanged = places => ({
  type: types.PLACES_CHANGED,
  places,
});

export const updateMapCenter = center => ({
  type: types.UPDATE_MAP_CENTER,
  center,
});

export const onMapLoad = google => ({
  type: types.ON_MAP_LOAD,
  google,
});

export const adjacencyListLoaded = (graph, busStopsMap, busServices) => ({
  type: types.AJACENCY_LIST_LOADED,
  graph,
  busStopsMap,
  busServices,
});

export const calculateRoute = (graph, busStopsMap, startStop, endStop) =>
  dispatch =>
    calculateRouteAction(graph, busStopsMap, startStop, endStop).then(
      (response) => {
        dispatch({
          type: types.CALCULATE_ROUTE,
          busStopsMap,
          routePath: response,
        });
        dispatch(push(`/directions/${startStop.bus_stop_id}/${endStop.bus_stop_id}`));
        dispatch(updateMapCenter({ lat: startStop.lat, lng: endStop.lng }));
      },
      (error) => {
        dispatch({
          type: types.CALCULATE_ROUTE_ERROR,
        });
        throw error;
      },
    );


// Bus stop actions
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
    const { map } = getState();
    const { busStopsMap, startStop, endStop } = map;

    if (start) {
      dispatch(selectStartStop(start));
    }

    if (end) {
      dispatch(selectEndStop(end));
    }

    if ((startStop && end) || (start && endStop) || (start && end)) {
      dispatch(calculateRoute(map.graph, busStopsMap, start || startStop, end || endStop));
    }
  };
