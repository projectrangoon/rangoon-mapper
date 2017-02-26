import { push } from 'react-router-redux';
import _ from 'lodash';
import types from '../constants/ActionTypes';
import { calculateRoute as calculateRouteAction } from '../utils';

export const handlePlacesChanged = places => ({
  type: types.PLACES_CHANGED,
  places,
});

export const updateMapCenter = (google, routePath) => {
  if (routePath.path.length > 1) {
    const bounds = new google.maps.LatLngBounds();
    routePath.path.forEach(stop => bounds.extend(stop));
    google.map.fitBounds(bounds);
    return { type: types.UPDATE_MAP_CENTER };
  }
  return { type: types.UPDATE_MAP_CENTER, center: routePath.path[0] };
};


export const drawPolylines = (google, routePath, startStop, endStop) => {
  const services = _.groupBy(routePath.path || [], 'service_name');
  _.map(services, (service) => {
    const polyline = new google.maps.Polyline({
      strokeColor: service[0].color,
      strokeOpacity: 0.5,
      strokeWeight: 2,
      clickable: false,
      path: service,
    });
    polyline.setMap(google.map);
  });

  const lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 0.5,
    scale: 4,
  };

  if (startStop.bus_stop_id !== routePath.path[0].bus_stop_id) {
    const polyline = new google.maps.Polyline({
      strokeColor: '#ffffff',
      strokeOpacity: 0,
      strokeWeight: 2,
      clickable: false,
      icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '20px',
      }],
      path: [startStop, routePath.path[0]],
    });
    polyline.setMap(google.map);
  }

  if (endStop.bus_stop_id !== routePath.path[routePath.path.length - 1].bus_stop_id) {
    const polyline = new google.maps.Polyline({
      strokeColor: '#ffffff',
      strokeOpacity: 0,
      strokeWeight: 2,
      clickable: false,
      icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '20px',
      }],
      path: [endStop, routePath.path[routePath.path.length - 1]],
    });
    polyline.setMap(google.map);
  }
};

export const calculateRoute = (graph, busStopsMap, startStop, endStop, google) =>
  dispatch =>
    calculateRouteAction(graph, busStopsMap, startStop, endStop).then(
      (routePath) => {
        if (google) {
          updateMapCenter(google, routePath);
          drawPolylines(google, routePath, startStop, endStop);
          dispatch({ type: types.PLACE_MARKERS, routePath });
          dispatch(push(`/directions/${startStop.bus_stop_id}/${endStop.bus_stop_id}`));
        }
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
