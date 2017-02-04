import types from '../constants/ActionTypes';

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

export const adjacencyListLoaded = (graph, busStopsMap) => ({
  type: types.AJACENCY_LIST_LOADED,
  graph,
  busStopsMap,
});

export const calculateRoute = (graph, busStopsMap, startStop, endStop) => ({
  type: types.CALCULATE_ROUTE,
  graph,
  busStopsMap,
  startStop,
  endStop,
});

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
    const {
      map,
    } = getState();


    const {
      busStopsMap,
      startStop,
      endStop,
    } = map;


    if (!startStop && start) {
      dispatch(selectStartStop(start));
    }

    if (!endStop && end) {
      dispatch(selectEndStop(end));
    }

    if ((startStop && end) || (start && endStop)) {
      const origin = start || startStop;
      const destination = end || endStop;
      dispatch(calculateRoute(map.graph, busStopsMap, origin, destination));
      // const center = {
      //   lat: parseFloat(origin.lat),
      //   lng: parseFloat(origin.lng),
      // };
      // dispatch(updateMapCenter(center));
    }
  };
