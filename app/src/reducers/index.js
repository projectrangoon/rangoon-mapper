import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import enhanceMapReducer from 'redux-map-gl';
import actions from './actions';
import map from './map';
import webglmap from './webglmap';
import busStops from './busStops';
import busServices from './busServices';
import modals from './modals';

const rootReducer = combineReducers({
  actions,
  map,
  webglmap: enhanceMapReducer(webglmap, {
    latitude: 16.7943528,
    longitude: 96.1518985,
    zoom: 15,
    bearing: 0,
    pitch: 45,
  }),
  busStops,
  busServices,
  modals,
  routing,
});

export default rootReducer;
