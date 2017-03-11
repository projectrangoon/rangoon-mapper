import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from '../App';
import PageNotFound from '../components/PageNotFound';
import HomeScreen from '../screens/HomeScreen';
import BusScreen from '../screens/BusScreen';

export default  (
  <Route path="/" component={App} >
    <IndexRoute component={HomeScreen} />
    <Route path="directions/:startStop/:endStop" component={HomeScreen} />
    <Route path="bus(/:serviceName)" components={BusScreen} />
    <Route path="stop(/:stopId)" component={BusScreen} />
    <Route path="*" components={{ main: PageNotFound }} />
  </Route>
);
