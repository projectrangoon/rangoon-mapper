import { browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';

import rootReducer from './reducers/index';

const routeMiddleware = routerMiddleware(browserHistory);

const logger = createLogger();

const globalStore = () => createStore(
  rootReducer,
  applyMiddleware(routeMiddleware),
  applyMiddleware(thunk, promise, logger),
);

export default globalStore;
