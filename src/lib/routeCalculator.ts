import TinyQueue from 'tinyqueue';

import { getNearbyStops, getStopsObjects } from '@/lib/geo';
import type { AdjacencyList, BusStop, BusStopsMap, RoutePath, RouteStep } from '@/types';

interface RouteCandidate {
  currCost: number;
  currDistance: number;
  currTransfers: number;
  path: RouteStep[];
  reachesDestination?: boolean;
}

interface RouteWeights {
  walkingDistance?: number;
  busDistanceCost?: number;
  perStopCost?: number;
  perTransferCost?: number;
  walkingCost?: number;
}

const getUniqueId = (busStopId: number, serviceName: number): string => {
  const paddedStopId = String(busStopId).padStart(5, 'Z');
  const paddedService = String(serviceName).padStart(2, 'B');
  return `${paddedStopId}${paddedService}`;
};

const normalizeResult = (route: RouteCandidate): RouteCandidate => {
  const result: RouteCandidate = {
    ...route,
    currTransfers: route.currTransfers > 0 ? route.currTransfers - 1 : 0,
    path: [...route.path],
  };

  const first = result.path[0];
  const second = result.path[1];
  if (first && second) {
    result.path[0] = {
      ...first,
      service_name: second.service_name,
    };
  }

  return result;
};

export const calculateRoute = (
  graph: AdjacencyList,
  busStopsMap: BusStopsMap,
  startStop: BusStop,
  endStop: BusStop,
  options: RouteWeights = {},
): RoutePath | null => {
  const {
    walkingDistance = 0.75,
    busDistanceCost = 0.7,
    perStopCost = 0.25,
    perTransferCost = 2.5,
    walkingCost = 7.5,
  } = options;

  const seen = new Set<string>();
  // Dijkstra queue ordered by weighted journey cost, then by raw travelled distance as a tie-breaker.
  const queue = new TinyQueue<RouteCandidate>([], (a, b) => {
    if (a.currCost === b.currCost) {
      return a.currDistance - b.currDistance;
    }
    return a.currCost - b.currCost;
  });

  queue.push({
    currCost: 0,
    currDistance: 0,
    currTransfers: 0,
    path: [{ bus_stop_id: startStop.bus_stop_id, service_name: 0, distance: 0 }],
  });

  const nearbyStops = getNearbyStops(busStopsMap, startStop, walkingDistance);
  nearbyStops.forEach((stop) => {
    const distance = stop.distance ?? 0;
    queue.push({
      currCost: distance * walkingCost,
      currDistance: 0,
      currTransfers: 0,
      path: [{ bus_stop_id: stop.bus_stop_id, service_name: 0, walk: true, distance }],
    });
  });

  while (queue.length > 0) {
    const top = queue.pop();
    if (!top) {
      break;
    }

    if (top.reachesDestination) {
      return getStopsObjects(busStopsMap, normalizeResult(top));
    }

    const lastKnownStop = top.path[top.path.length - 1];
    if (!lastKnownStop) {
      continue;
    }

    const lastKnownServiceName = lastKnownStop.service_name;

    if (lastKnownStop.bus_stop_id === endStop.bus_stop_id) {
      return getStopsObjects(busStopsMap, normalizeResult(top));
    }

    const nearbyLastKnownStops = getNearbyStops(busStopsMap, lastKnownStop, walkingDistance);
    const found = nearbyLastKnownStops.find((stop) => stop.bus_stop_id === endStop.bus_stop_id);
    if (found) {
      const distance = found.distance ?? 0;
      // Walking the final leg is treated as another candidate in the queue instead of an early return,
      // so the planner can still compare "get off and walk now" against "stay on the bus a bit longer".
      const candidate = {
        ...top,
        currCost: top.currCost + distance * walkingCost,
        reachesDestination: true,
        path: [...top.path],
      };
      const lastPathIndex = candidate.path.length - 1;
      const currentLast = candidate.path[lastPathIndex];
      if (currentLast) {
        candidate.path[lastPathIndex] = {
          ...currentLast,
          walk: true,
          distance,
        };
      }

      queue.push(candidate);
    }

    const lastStopId = getUniqueId(lastKnownStop.bus_stop_id, lastKnownServiceName);
    if (seen.has(lastStopId)) {
      continue;
    }
    // Visiting by stop+service keeps circular routes explorable while still pruning worse repeats.
    seen.add(lastStopId);

    const neighbours = graph[lastKnownStop.bus_stop_id] ?? [];

    neighbours.forEach((neighbour) => {
      const candidate: RouteCandidate = {
        ...top,
        currDistance: top.currDistance + neighbour.distance,
        path: [
          ...top.path,
          {
            bus_stop_id: neighbour.bus_stop_id,
            service_name: neighbour.service_name,
            distance: neighbour.distance,
          },
        ],
      };

      if (lastKnownServiceName !== neighbour.service_name) {
        candidate.currTransfers = top.currTransfers + 1;
        // Boarding the first bus should not count as a transfer; only service changes after that do.
        candidate.currCost = top.currCost + (lastKnownServiceName === 0 ? 0 : perTransferCost);
      } else {
        candidate.currCost = top.currCost;
      }

      candidate.currCost += neighbour.distance * busDistanceCost + perStopCost;
      queue.push(candidate);
    });
  }

  return null;
};
