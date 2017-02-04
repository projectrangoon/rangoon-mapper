import { browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
// import createLogger from 'redux-logger';

import rootReducer from './reducers/index';

const middlewares = [thunk, promise];

if (process.env.NODE_ENV === 'development') {
  const createLogger = require('redux-logger'); // eslint-disable-line global-require
  const logger = createLogger();
  middlewares.push(logger);
}
const routeMiddleware = routerMiddleware(browserHistory);

const globalStore = () => createStore(
  rootReducer,
  applyMiddleware(routeMiddleware),
  applyMiddleware(...middlewares),
);

export default globalStore;
