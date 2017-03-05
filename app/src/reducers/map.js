import types from '../constants/ActionTypes';

const initialState = {
  center: { lat: 16.7943528, lng: 96.1518985 },
  zoom: 15,
  startStop: null,
  startStopValue: '',
  endStop: null,
  endStopValue: '',
  routePath: null,
  graph: null,
  google: null,
  busStopsMap: null,
  busServices: null,
  polylines: null,
  calculatingRoute: false,
  updatingMap: false,
  drawingPolylines: false,
  swappingStops: false,
};

const map = (state = initialState, action) => {
  switch (action.type) {
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
      const { startStop, routePath, calculatingRoute } = action.payload;
      return Object.assign({}, state, {
        startStop,
        routePath,
        calculatingRoute,
      });
    }

    case types.SELECT_END_STOP_SUCCESS: {
      const { endStop, routePath, calculatingRoute } = action.payload;
      return Object.assign({}, state, {
        endStop,
        routePath,
        calculatingRoute,
      });
    }

    case types.UPDATE_MAP_CENTER_REQUEST: {
      return Object.assign({}, state, {
        updatingMap: true,
      });
    }
    case types.UPDATE_MAP_CENTER_SUCCESS: {
      return Object.assign({}, state, {
        center: action.payload.center,
        updatingMap: false,
      });
    }
    case types.UPDATE_MAP_CENTER_FAIL: {
      return Object.assign({}, state, {
        updatingMap: false,
      });
    }

    case types.CALCULATE_ROUTE_REQUEST: {
      return Object.assign({}, state, {
        calculatingRoute: true,
      });
    }
    case types.CALCULATE_ROUTE_SUCCESS: {
      return Object.assign({}, state, {
        routePath: action.payload.routePath,
      });
    }
    case types.CALCULATE_ROUTE_FAIL: {
      return Object.assign({}, state, {
        calculatingRoute: false,
      });
    }

    case types.DRAW_POLYLINES_REQUEST: {
      return Object.assign({}, state, {
        drawingPolylines: true,
      });
    }
    case types.DRAW_POLYLINES_SUCCESS: {
      return Object.assign({}, state, {
        polylines: action.payload.polylines,
        drawingPolylines: false,
        calculatingRoute: false,
      });
    }
    case types.DRAW_POLYLINES_FAIL: {
      return Object.assign({}, state, {
        drawingPolylines: false,
      });
    }

    case types.CLEAR_POLYLINES_SUCCESS: {
      return Object.assign({}, state, {
        polylines: action.payload.polylines,
      });
    }

    case types.CHANGE_START_STOP_VALUE_SUCCESS: {
      return Object.assign({}, state, {
        startStopValue: action.payload,
      });
    }

    case types.CHANGE_END_STOP_VALUE_SUCCESS: {
      return Object.assign({}, state, {
        endStopValue: action.payload,
      });
    }

    case types.SWAP_STOPS_REQUEST: {
      return Object.assign({}, state, {
        startStop: state.endStop,
        endStop: state.startStop,
        startStopValue: `${state.endStop.name_en} ${state.endStop.name_mm}`,
        endStopValue: `${state.startStop.name_en} ${state.startStop.name_mm}`,
        swappingStops: true,
        calculatingRoute: true,
      });
    }

    case types.SWAP_STOPS_SUCCESS: {
      return Object.assign({}, state, {
        swappingStops: false,
        calculatingRoute: false,
      });
    }

    default: {
      return state;
    }
  }
};

export default map;
