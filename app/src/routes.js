import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import Map from './containers/map';
import PageNotFound from './components/PageNotFound';
import Sidebar from './containers/sidebar';

module.exports = (
  <Route path="/" component={App} >
    <IndexRoute components={{ main: Map, sidebar: Sidebar }} />
    <Route path="directions/:startStop/:endStop" components={{ main: Map, sidebar: Sidebar }} />
    <Route path="*" components={{ main: PageNotFound, sidebar: null }} />
  </Route>
);
