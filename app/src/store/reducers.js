import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import map from '../containers/Map/reducer';
import webglmap from '../containers/WebGLMap/reducer';

const rootReducer = combineReducers({
  map,
  webglmap,
  routing,
});

export default rootReducer;
