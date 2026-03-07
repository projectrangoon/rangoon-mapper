import { Effect } from 'effect';
import { create } from 'zustand';

import { calculateRouteEffect } from '@/lib/routeCalculatorEffect';
import type { AdjacencyList, BusService, BusServicesMap, BusStop, BusStopsMap, RoutePath, UniqueStop } from '@/types';

interface MapStoreState {
  center: { lat: number; lng: number };
  zoom: number;
  graph: AdjacencyList | null;
  busStopsMap: BusStopsMap | null;
  busServices: BusServicesMap | null;
  uniqueStops: UniqueStop[];
  startStop: BusStop | null;
  endStop: BusStop | null;
  routePath: RoutePath | null;
  isCalculating: boolean;
  isDataReady: boolean;
  loadData: (payload: {
    graph: AdjacencyList;
    busStopsMap: BusStopsMap;
    busServices: Record<string, BusService>;
    uniqueStops: UniqueStop[];
  }) => void;
  setViewport: (center: { lat: number; lng: number }, zoom?: number) => void;
  setStartStop: (startStop: BusStop | null) => void;
  setEndStop: (endStop: BusStop | null) => void;
  setRoutePath: (routePath: RoutePath | null) => void;
  clearRoute: () => void;
  getStopById: (stopId: number) => BusStop | null;
  calculateCurrentRoute: () => Promise<RoutePath | null>;
}

const defaultCenter = { lat: 16.7943528, lng: 96.1518985 };

export const useMapStore = create<MapStoreState>((set, get) => ({
  center: defaultCenter,
  zoom: 13,
  graph: null,
  busStopsMap: null,
  busServices: null,
  uniqueStops: [],
  startStop: null,
  endStop: null,
  routePath: null,
  isCalculating: false,
  isDataReady: false,
  loadData: ({ graph, busStopsMap, busServices, uniqueStops }) => {
    set({ graph, busStopsMap, busServices, uniqueStops, isDataReady: true });
  },
  setViewport: (center, zoom) => {
    set((state) => ({ center, zoom: zoom ?? state.zoom }));
  },
  setStartStop: (startStop) => {
    set({ startStop });
  },
  setEndStop: (endStop) => {
    set({ endStop });
  },
  setRoutePath: (routePath) => {
    set({ routePath });
  },
  clearRoute: () => {
    set({ routePath: null });
  },
  getStopById: (stopId) => {
    const busStopsMap = get().busStopsMap;
    if (!busStopsMap) {
      return null;
    }
    return busStopsMap[stopId] ?? null;
  },
  calculateCurrentRoute: () => {
    const { graph, busStopsMap, startStop, endStop } = get();
    const program = Effect.gen(function* () {
      if (!graph || !busStopsMap || !startStop || !endStop) {
        yield* Effect.sync(() => set({ routePath: null }));
        return null;
      }

      yield* Effect.sync(() => set({ isCalculating: true }));

      const routePath = yield* calculateRouteEffect(graph, busStopsMap, startStop, endStop);

      yield* Effect.sync(() => set({ routePath }));
      return routePath;
    }).pipe(
      Effect.ensuring(Effect.sync(() => set({ isCalculating: false }))),
    );

    return Effect.runPromise(program);
  },
}));
