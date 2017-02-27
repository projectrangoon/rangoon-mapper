import { calculateRoute } from '../utils';
import graph from '../../../experiment/adjancencyList.json';
import busStopsMap from '../../../experiment/stops_map.json';
// import busStops from '../../../experiment/unique_stops.json';


describe('Calculating Route', () => {
  it('Sein Gyun to Pazundaung Zay', () => {
    const startStop = busStopsMap[118];
    const endStop = busStopsMap[448];
    calculateRoute(graph, busStopsMap, startStop, endStop).then((result) => {
      expect(result.path).toEqual(
        [{ bus_stop_id: 190, service_name: 56, walk: true },
        { bus_stop_id: 189, service_name: 56 },
        { bus_stop_id: 191, service_name: 56 },
        { bus_stop_id: 174, service_name: 56 },
        { bus_stop_id: 176, service_name: 56 },
        { bus_stop_id: 156, service_name: 56, walk: true }]);
    });
  });
});
