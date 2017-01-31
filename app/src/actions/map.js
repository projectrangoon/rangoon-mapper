import types from '../constants/ActionTypes';

export const handlePlacesChanged = places => ({
  type: types.PLACES_CHANGED,
  places,
});

export const updateMapCenter = center => ({
  type: types.UPDATE_MAP_CENTER,
  center,
});

export const onMapLoad = () => ({
  type: types.ON_MAP_LOAD,
});

export const adjacencyListLoaded = graph => ({
  type: types.AJACENCY_LIST_LOADED,
  graph,
});

export const calculateRoute = (graph, startStop, endStop) => ({
  type: types.CALCULATE_ROUTE,
  graph,
  startStop,
  endStop,
});

