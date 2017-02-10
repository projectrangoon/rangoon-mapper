import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import Map from './containers/map';
import PageNotFound from './components/PageNotFound';
import Sidebar from './containers/sidebar';
import { selectStartEndStop } from './actions/map';
import allBusStops from '../../experiment/unique_stops.json';
import globalStore from './globalStore';


const onEnter = (store) => {
  return (nextState) => {
    const startStop = allBusStops[nextState.params.startStop];
    const endStop = allBusStops[nextState.params.endStop];
    console.log(startStop);
    console.log(endStop);
    store().dispatch(selectStartEndStop(startStop, endStop));
  }
};

module.exports = (
  <Route path="/" component={App} >
    <IndexRoute components={{ main: Map, sidebar: Sidebar }} />
    <Route path="/route/:startStop/:endStop" components={{ main: Map, sidebar: Sidebar }} onEnter={onEnter(globalStore)} />
    <Route path="*" component={PageNotFound} />
  </Route>
);
