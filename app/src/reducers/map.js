import types from '../constants/ActionTypes';

const initialState = {
  center: { lat: 16.7943528, lng: 96.1518985 },
  zoom: 15,
  startStop: null,
  endStop: null,
  routePath: null,
  graph: null,
  google: null,
  busStopsMap: null,
  busServices: null,
  polylines: null,
};

const map = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_MAP_CENTER_SUCCESS: {
      return Object.assign({}, state, {
        center: action.payload.center,
      });
    }

    case types.LOAD_ADJACENCY_LIST_SUCCESS: {
      return Object.assign({}, state, {
        graph: action.payload.graph,
        busStopsMap: action.payload.busStopsMap,
        busServices: action.payload.busServices,
      });
    }

    case types.LOAD_MAP_SUCCESS: {
      const { google } = action.payload;
      return Object.assign({}, state, {
        google,
      });
    }

    case types.SELECT_START_STOP_SUCCESS: {
      return Object.assign({}, state, {
        startStop: action.payload.startStop,
      });
    }

    case types.SELECT_END_STOP_SUCCESS: {
      return Object.assign({}, state, {
        endStop: action.payload.endStop,
      });
    }

    case types.CALCULATE_ROUTE_SUCCESS: {
      return Object.assign({}, state, {
        routePath: action.payload.routePath,
      });
    }

    case types.DRAW_POLYLINES_SUCCESS: {
      return Object.assign({}, state, {
        polylines: action.payload.polylines,
      });
    }

    default: {
      return state;
    }
  }
};

export default map;
