import { browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux'

import rootReducer from './reducers/index';

const routeMiddleware = routerMiddleware(browserHistory)

const globalStore = () => createStore(
  rootReducer,
  applyMiddleware(routeMiddleware)
);

export default globalStore
