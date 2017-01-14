import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'

import routes from './routes';
import globalStore from './globalStore';
import './index.css';

const store = globalStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes}>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// Log the initial state
console.log(store.getState())

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
store.subscribe(() =>
  console.log(store.getState())
);
