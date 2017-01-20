import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import actions from './actions';
import map from './map';
import busStops from './busStops';
import busServices from './busServices';
import modals from './modals';

const rootReducer = combineReducers({
  actions,
  map,
  busStops,
  busServices,
  modals,
  routing,
});

export default rootReducer;
