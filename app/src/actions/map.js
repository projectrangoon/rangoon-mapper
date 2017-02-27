import { push } from 'react-router-redux';
import _ from 'lodash';
import types from '../constants/ActionTypes';
import { calculateRoute as calculateRouteAction, drawPolylines as drawPolylinesAction, createActions } from '../utils';

// Begin Action creators
// const handlePlacesChangedActions = createActions([
//   types.PLACES_CHANGED_REQUEST,
//   types.PLACES_CHANGED_SUCCESS,
//   types.PLACES_CHANGED_FAIL,
// ]);
const updateMapCenterActions = createActions([
  types.UPDATE_MAP_CENTER_REQUEST,
  types.UPDATE_MAP_CENTER_SUCCESS,
  types.UPDATE_MAP_CENTER_FAIL,
]);
const mapLoadActions = createActions([
  types.MAP_LOAD_REQUEST,
  types.MAP_LOAD_SUCCESS,
  types.MAP_LOAD_FAIL,
]);
const loadAdjacencyListActions = createActions([
  types.AJACENCY_LOAD_REQUEST,
  types.AJACENCY_LOAD_SUCCESS,
  types.AJACENCY_LOAD_FAIL,
]);
const calculateRouteActions = createActions([
  types.CALCULATE_ROUTE_REQUEST,
  types.CALCULATE_ROUTE_SUCCESS,
  types.CALCULATE_ROUTE_ERROR,
]);
const drawPolylinesActions = createActions([
  types.DRAW_POLYLINES_REQUEST,
  types.DRAW_POLYLINES_SUCCESS,
  types.DRAW_POLYLINES_FAIL,
]);
const selectStartStopActions = createActions([
  types.SELECT_START_STOP_REQUEST,
  types.SELECT_START_STOP_SUCCESS,
  types.SELECT_START_STOP_FAIL,
]);
const selectEndStopActions = createActions([
  types.SELECT_END_STOP_REQUEST,
  types.SELECT_END_STOP_SUCCESS,
  types.SELECT_END_STOP_FAIL,
]);
// End Action creators

// export const handlePlacesChanged = places => ({
//   type: types.PLACES_CHANGED,
//   places,
// });
export const updateMapCenter = () => (dispatch, getState) => {
  const { map } = getState();
  const { google, routePath } = map;
  if (routePath.path.length > 1) {
    dispatch(updateMapCenterActions.request(map));
    const bounds = new google.maps.LatLngBounds();
    routePath.path.forEach(stop => bounds.extend(stop));
    google.map.fitBounds(bounds);
    dispatch(updateMapCenterActions.success(map));
  }
};

export const drawPolylines = () =>
  (dispatch, getState) => {
    const { map } = getState();
    const { google, routePath, startStop, endStop, polylines } = map;

    // Clear all previous polylines from state if there are any
    if (polylines) {
      // can still put in actions if we would like to e.g (dispatch(removePolylines()))
      _.map(polylines, (polyline) => {
        polyline.setMap(null);
      });
    }

    dispatch(drawPolylinesActions.request());

    drawPolylinesAction(google, routePath, startStop, endStop).then(
      (response) => {
        dispatch(drawPolylinesActions.success({ polylines: response }));
      },
      (error) => {
        dispatch(drawPolylinesActions.fail(error));
      },
    );
  };

export const calculateRoute = (startStop, endStop) =>
  (dispatch, getState) => {
    const { map } = getState();
    const { graph, busStopsMap } = map;

    dispatch(calculateRouteActions.request());

    calculateRouteAction(graph, busStopsMap, startStop, endStop).then(
      (routePath) => {
        dispatch(calculateRouteActions.success({ routePath }));
        dispatch(updateMapCenter());
        dispatch(drawPolylines());
        dispatch(push(`/directions/${startStop.bus_stop_id}/${endStop.bus_stop_id}`));
      },
      (error) => {
        dispatch(calculateRouteActions.fail(error));
      },
    );
  };

export const onMapLoad = google =>
  (dispatch, getState) => {
    const { map } = getState();
    const { startStop, endStop } = map;

    dispatch({ type: types.ON_MAP_LOAD, google });

    if (startStop && endStop) {
      dispatch(calculateRoute(startStop, endStop));
    }
  };

export const adjacencyListLoaded = (graph, busStopsMap, busServices) => ({
  type: types.AJACENCY_LIST_LOADED,
  graph,
  busStopsMap,
  busServices,
});

export const selectStartStop = startStop =>
  (dispatch) => {
    dispatch(selectStartStopActions.success({ startStop }));
  };

export const selectEndStop = endStop =>
  (dispatch) => {
    dispatch(selectEndStopActions.success({ endStop }));
  };

export const selectStartEndStop = (start, end) =>
  (dispatch, getState) => {
    const { map } = getState();
    const { startStop, endStop, google } = map;

    if (start) {
      dispatch(selectStartStop(start));
    }

    if (end) {
      dispatch(selectEndStop(end));
    }

    if (google && ((startStop && end) || (start && endStop) || (start && end))) {
      dispatch(calculateRoute(start || startStop, end || endStop));
    }
  };
