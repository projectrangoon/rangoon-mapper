import React from 'react';
import configureStore from 'redux-mock-store';

import { calculateRoute } from '../utils';
import graph from '../../../experiment/adjancencyList.json';
import allBusStops from '../../../experiment/all_bus_stops.json';


describe('Calculating Route', () => {
  it('Simple straightline route', () => {
    const startStop = allBusStops[4524];
    const endStop = allBusStops[4527];
    expect(calculateRoute(graph, startStop, endStop)).toBe([
      {
        lat: 16.774918,
        lng: 96.142353,
      },
      {
        lat: 16.774744,
        lng: 96.146441,
      },
      {
        lat: 16.774456,
        lng: 96.15187,
      }]);
  });
});
