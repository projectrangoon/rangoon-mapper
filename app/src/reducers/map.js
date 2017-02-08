import types from '../constants/ActionTypes';
import { calculateRoute } from '../utils';

const initialState = {
  center: { lat: 16.7943528, lng: 96.1518985 },
  zoom: 15,
  startStop: null,
  endStop: null,
  routeMarkers: null,
  routePath: null,
  graph: null,
  google: null,
  busStopsMap: null,
};

const map = (state = initialState, action) => {
  switch (action.type) {
    case types.PLACES_CHANGED: {
      const location = action.places[0].geometry.location;
      const center = { lat: location.lat(), lng: location.lng() };
      return Object.assign({}, state, {
        center,
      });
    }
    case types.UPDATE_MAP_CENTER: {
      return Object.assign({}, state, {
        center: action.center,
      });
    }
    case types.DRAW_ROUTE: {
      return Object.assign({}, state, {
        routeMarkers: action.routeMarkers,
      });
    }
    case types.CALCULATE_ROUTE: {
      const { graph, busStopsMap, startStop, endStop } = action;
      const routePath = calculateRoute(graph, busStopsMap, startStop, endStop);
      let payload = {};
      if (routePath && routePath.path) {
        payload = { ...routePath, path: [] };
        routePath.path.forEach((busStop) => {
          payload.path.push(busStopsMap[busStop.bus_stop_id]);
        });
      }
      return Object.assign({}, state, {
        routePath: payload,
      });
    }
    case types.AJACENCY_LIST_LOADED: {
      return Object.assign({}, state, {
        graph: action.graph,
        busStopsMap: action.busStopsMap,
      });
    }
    case types.ON_MAP_LOAD: {
      const { google } = action;
      return Object.assign({}, state, {
        google,
      });
    }
    case types.SELECT_START_STOP: {
      return Object.assign({}, state, {
        startStop: action.startStop,
      });
    }
    case types.SELECT_END_STOP: {
      return Object.assign({}, state, {
        endStop: action.endStop,
      });
    }
    default: {
      return state;
    }
  }
};

export default map;
