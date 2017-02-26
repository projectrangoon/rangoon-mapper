import _ from 'lodash';
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

    case types.CALCULATE_ROUTE: {
      const { routePath, busStopsMap } = action;
      let payload = {};
      let polylines = {};
      if (routePath && routePath.path) {
        payload = { ...routePath, path: [] };
        routePath.path.forEach((busStop) => {
          const stop = busStopsMap[busStop.bus_stop_id];
          stop.service_name = busStop.service_name;
          payload.path.push(stop);
        });

        if (payload.path.length >= 2) {
          payload.path[0].service_name = payload.path[1].service_name;
        }

        polylines = _.groupBy(payload.path || [], 'service_name');
      }
      return Object.assign({}, state, {
        routePath: payload,
        polylines,
      });
    }

    case types.AJACENCY_LIST_LOADED: {
      return Object.assign({}, state, {
        graph: action.graph,
        busStopsMap: action.busStopsMap,
        busServices: action.busServices,
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
