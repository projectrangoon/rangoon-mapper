import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import routes from './routes';
import globalStore from './globalStore';

const store = globalStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

// Google analytics
const ReactGA = require('react-ga');

ReactGA.initialize('UA-75086119-2');

const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

ReactDOM.render(
  <Provider store={store}>
    {window.location.host === 'mapper.rangoon.io' ? (
      <Router history={history} routes={routes} onUpdate={logPageView} />
    ) : (
      <Router history={history} routes={routes} />
    )}
  </Provider>,
  document.getElementById('root'),
);
