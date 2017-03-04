import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import actions from './actions';
import map from './map';
import webglmap from './webglmap';
import busStops from './busStops';
import busServices from './busServices';
import modals from './modals';

const rootReducer = combineReducers({
  actions,
  map,
  webglmap,
  busStops,
  busServices,
  modals,
  routing,
});

export default rootReducer;
