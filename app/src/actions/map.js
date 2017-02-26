import { push } from 'react-router-redux';
import _ from 'lodash';
import types from '../constants/ActionTypes';
import { calculateRoute as calculateRouteAction } from '../utils';

export const handlePlacesChanged = places => ({
  type: types.PLACES_CHANGED,
  places,
});

export const updateMapCenter = (google, routePath) => {
  const bounds = new google.maps.LatLngBounds();
  routePath.path.forEach(stop => bounds.extend(stop));
  google.map.fitBounds(bounds);
};

export const calculateRoute = (graph, busStopsMap, startStop, endStop, google) =>
  dispatch =>
    calculateRouteAction(graph, busStopsMap, startStop, endStop).then(
      (routePath) => {
        let payload = {};
        let polylines = {};
        if (routePath && routePath.path) {
          payload = { ...routePath, path: [] };
          routePath.path.forEach((busStop) => {
            const stop = busStopsMap[busStop.bus_stop_id];
            stop.service_name = busStop.service_name;
            if (busStop.walk) {
              stop.walk = true;
            }
            payload.path.push(stop);
          });
          polylines = _.groupBy(payload.path || [], 'service_name');

          if (google) {
            updateMapCenter(google, payload);
          }
        }
        dispatch(push(`/directions/${startStop.bus_stop_id}/${endStop.bus_stop_id}`));
        dispatch({ type: types.DRAW_POLYLINES, polylines, payload });
      },
      (error) => {
        dispatch({
          type: types.CALCULATE_ROUTE_ERROR,
        });
        throw error;
      },
    );

export const onMapLoad = google =>
  (dispatch, getState) => {
    const { map } = getState();
    const { busStopsMap, startStop, endStop } = map;

    dispatch({ type: types.ON_MAP_LOAD, google });

    if (startStop && endStop) {
      dispatch(calculateRoute(map.graph, busStopsMap, startStop, endStop, google));
    }
  };

export const adjacencyListLoaded = (graph, busStopsMap, busServices) => ({
  type: types.AJACENCY_LIST_LOADED,
  graph,
  busStopsMap,
  busServices,
});

// export const drawPolylines = (graph, busStopsMap, startStop, endStop) => {};


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
    const { busStopsMap, startStop, endStop, google } = map;

    if (start) {
      dispatch(selectStartStop(start));
    }

    if (end) {
      dispatch(selectEndStop(end));
    }

    if (google && ((startStop && end) || (start && endStop) || (start && end))) {
      dispatch(calculateRoute(map.graph, busStopsMap, start || startStop, end || endStop));
    }
  };
