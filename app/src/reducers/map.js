import types from '../constants/ActionTypes';
import { calculateRoute } from '../utils';

const initialState = {
  center: { lat: 16.7943528, lng: 96.1518985 },
  zoom: 15,
  routeMarkers: null,
  routePath: null,
  graph: null,
  google: null,
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
      const { graph, startStop, endStop } = action;
      const route = calculateRoute(graph, startStop, endStop);
      return Object.assign({}, state, {
        routeMarkers: route,
      });
    }
    case types.AJACENCY_LIST_LOADED: {
      return Object.assign({}, state, {
        graph: action.graph,
      });
    }
    case types.ON_MAP_LOAD: {
      const { google } = action;
      return Object.assign({}, state, {
        google,
      });
    }
    default: {
      return state;
    }
  }
};

export default map;
