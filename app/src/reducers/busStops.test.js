import { calculateRoute } from '../utils';
import graph from '../../../experiment/adjancencyList.json';
import allBusStops from '../../../experiment/all_bus_stops.json';


describe('Calculating Route', () => {
  it('Short straightline path', () => {
    const startStop = allBusStops[4524];
    const endStop = allBusStops[4527];
    expect(calculateRoute(graph, startStop, endStop)).toEqual({
      currCost: NaN,
      currDistance: 1.3202002349059285,
      currTransfers: 0,
      path: [
        startStop,
        allBusStops[4525],
        allBusStops[4526],
        endStop,
      ] });
  });

  // it('Long straightline path', () => {
  //   const startStop = allBusStops[2];
  //   const endStop = allBusStops[23];
  //   expect(calculateRoute(graph, startStop, endStop)).toEqual(allBusStops.slice(4522, 4546));
  // });
});
