import { browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';

import rootReducer from './reducers';

const router = routerMiddleware(browserHistory);

const middlewares = [
  router,
  thunk,
  promise,
];

let composeEnhancers = compose;

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger();
  middlewares.push(logger);
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line
}

const globalStore = () => createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares)),
);

export default globalStore;
