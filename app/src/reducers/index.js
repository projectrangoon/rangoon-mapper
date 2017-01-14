import { combineReducers } from 'redux';
import actions from './actions';
import map from './map';
import modals from './modals';
import { routerReducer as routing } from 'react-router-redux';

const rootReducer = combineReducers({
  actions,
  map,
  modals,
  routing,
})

export default rootReducer
