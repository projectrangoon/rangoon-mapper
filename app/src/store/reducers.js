import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import actions from '../reducers/actions';
import map from '../reducers/map';
import webglmap from '../reducers/webglmap';
import busStops from '../reducers/busStops';
import busServices from '../reducers/busServices';
import modals from '../reducers/modals';

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
