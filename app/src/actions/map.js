import { push } from 'react-router-redux';
import _ from 'lodash';
import types from '../constants/ActionTypes';
import { calculateRoute as calculateRouteAction, drawPolylines as drawPolylinesAction, createActions } from '../utils';

// Begin Action creators
const updateMapCenterActions = createActions([
  types.UPDATE_MAP_CENTER_REQUEST,
  types.UPDATE_MAP_CENTER_SUCCESS,
  types.UPDATE_MAP_CENTER_FAIL,
]);
const loadAdjacencyListActions = createActions([
  types.LOAD_ADJACENCY_LIST_REQUEST,
  types.LOAD_ADJACENCY_LIST_SUCCESS,
  types.LOAD_ADJACENCY_LIST_FAIL,
]);
const loadMapActions = createActions([
  types.LOAD_MAP_REQUEST,
  types.LOAD_MAP_SUCCESS,
  types.LOAD_MAP_FAIL,
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
const clearPolylinesActions = createActions([
  types.CLEAR_POLYLINES_REQUEST,
  types.CLEAR_POLYLINES_SUCCESS,
  types.CLEAR_POLYLINES_FAIL,
]);
const swapStopsActions = createActions([
  types.SWAP_STOPS_REQUEST,
  types.SWAP_STOPS_SUCCESS,
  types.SWAP_STOPS_FAIL,
]);
const changeStartStopValueActions = createActions([
  types.CHANGE_START_STOP_VALUE_REQUEST,
  types.CHANGE_START_STOP_VALUE_SUCCESS,
  types.CHANGE_START_STOP_VALUE_FAIL,
]);
const changeEndStopValueActions = createActions([
  types.CHANGE_END_STOP_VALUE_REQUEST,
  types.CHANGE_END_STOP_VALUE_SUCCESS,
  types.CHANGE_END_STOP_VALUE_FAIL,
]);
// End Action creators

export const updateMapCenter = () => (dispatch, getState) => {
  const { map } = getState();
  const { google, startStop, endStop, routePath } = map;
  if (routePath.path.length > 1) {
    dispatch(updateMapCenterActions.request(map));
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(startStop);
    routePath.path.forEach(stop => bounds.extend(stop));
    bounds.extend(endStop);
    google.map.fitBounds(bounds);
    if (window.innerWidth >= 768) {
      google.map.setZoom(google.map.getZoom() - 1);
      google.map.panBy(-200, 0);
    }
    dispatch(updateMapCenterActions.success(map));
  } else {
    dispatch(updateMapCenterActions.success({ ...map, center: routePath.path[0] }));
  }
};

export const clearPolylines = () => (dispatch, getState) => {
  const { map } = getState();
  const { polylines } = map;

  dispatch(clearPolylinesActions.request());
  _.map(polylines, (polyline) => {
    polyline.setMap(null);
  });
  dispatch(clearPolylinesActions.success({ polylines: null }));
};

export const drawPolylines = () =>
  (dispatch, getState) => {
    const { map } = getState();
    const { google, startStop, endStop, polylines, routePath } = map;

    if (polylines) {
      dispatch(clearPolylines());
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
    const { graph, busStopsMap, polylines } = map;

    if (polylines) {
      dispatch(clearPolylines());
    }

    dispatch(calculateRouteActions.request());

    return new Promise((resolve, reject) => {
      calculateRouteAction(graph, busStopsMap, startStop, endStop).then(
        (routePath) => {
          resolve(dispatch(calculateRouteActions.success({ routePath })));
          dispatch(updateMapCenter());
          dispatch(drawPolylines());
          dispatch(push(`/directions/${startStop.bus_stop_id}/${endStop.bus_stop_id}`));
        },
        (error) => {
          reject(dispatch(calculateRouteActions.fail(error)));
        },
      );
    });
  };

export const loadMap = google =>
  (dispatch, getState) => {
    const { map } = getState();
    const { startStop, endStop } = map;

    dispatch(loadMapActions.success({ google }));

    if (startStop && endStop) {
      dispatch(calculateRoute(startStop, endStop));
    }
  };

export const loadAdjacencyList = (graph, busStopsMap, busServices) =>
  (dispatch) => {
    dispatch(loadAdjacencyListActions.success({ graph, busStopsMap, busServices }));
  };

export const selectStartStop = startStop =>
  (dispatch, getState) => {
    const { map } = getState();
    const { endStop, google } = map;
    if (!startStop) {
      dispatch(clearPolylines());
    }
    if (google && startStop && endStop) {
      dispatch(selectStartStopActions.success({ startStop,
        routePath: null,
        calculatingRoute: true,
      }));
      setTimeout(() => { dispatch(calculateRoute(startStop, endStop)); }, 100);
    } else {
      dispatch(selectStartStopActions.success({ startStop,
        routePath: null,
        calculatingRoute: false,
      }));
    }
  };

export const selectEndStop = endStop =>
  (dispatch, getState) => {
    const { map } = getState();
    const { startStop, google } = map;
    if (!endStop) {
      dispatch(clearPolylines());
    }
    if (google && startStop && endStop) {
      dispatch(selectEndStopActions.success({ endStop,
        routePath: null,
        calculatingRoute: true,
      }));
      setTimeout(() => { dispatch(calculateRoute(startStop, endStop)); }, 100);
    } else {
      dispatch(selectEndStopActions.success({ endStop,
        routePath: null,
        calculatingRoute: false,
      }));
    }
  };

export const changeStartStopValue = value =>
  (dispatch) => {
    dispatch(changeStartStopValueActions.success(value));
  };

export const changeEndStopValue = value =>
  (dispatch) => {
    dispatch(changeEndStopValueActions.success(value));
  };

export const swapStops = () => (dispatch, getState) => {
  const { map } = getState();
  const { startStop, endStop } = map;

  if (startStop && endStop) {
    dispatch(swapStopsActions.request());
    setTimeout(() => {
      dispatch(calculateRoute(endStop, startStop)).then(() => {
        dispatch(swapStopsActions.success());
      });
    }, 100);
  }
};
