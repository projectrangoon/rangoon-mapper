import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import map from '../containers/Map/reducer';
import webglmap from '../containers/WebGLMap/reducer';
import busServicesSidebar from '../containers/BusServicesSidebar/reducer';

const rootReducer = combineReducers({
  map,
  webglmap,
  routing,
  busServicesSidebar,
});

export default rootReducer;
