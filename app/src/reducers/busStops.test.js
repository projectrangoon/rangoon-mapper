import { calculateRoute } from '../utils';
import graph from '../../../experiment/adjancencyList.json';
import busStopsMap from '../../../experiment/stops_map.json';
import busStops from '../../../experiment/unique_stops.json';


describe('Calculating Route', () => {
  it('Short straightline path', () => {
    const startStop = busStopsMap[152];
    const endStop = busStopsMap[136];

    const result = calculateRoute(graph, busStopsMap, startStop, endStop);
    console.log(result.serviceNames);
    expect(result.path).toEqual([
      startStop,
      busStopsMap[132],
      busStopsMap[133],
      busStopsMap[134],
      busStopsMap[135],
      endStop,
    ]);
  });

  // it('Long straightline path', () => {
  //   const startStop = allBusStops[2];
  //   const endStop = allBusStops[23];
  //   expect(calculateRoute(graph, startStop, endStop)).toEqual(allBusStops.slice(4522, 4546));
  // });
});
