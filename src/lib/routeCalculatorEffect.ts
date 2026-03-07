import { Effect } from 'effect';

import { calculateRoute } from '@/lib/routeCalculator';
import type { AdjacencyList, BusStop, BusStopsMap, RoutePath } from '@/types';

export const calculateRouteEffect = (
  graph: AdjacencyList,
  busStopsMap: BusStopsMap,
  startStop: BusStop,
  endStop: BusStop,
): Effect.Effect<RoutePath | null> =>
  Effect.sync(() => calculateRoute(graph, busStopsMap, startStop, endStop));
