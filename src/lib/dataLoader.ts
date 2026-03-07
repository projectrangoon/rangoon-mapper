import { Data, Effect } from 'effect';

import type { AdjacencyList, BusService, BusServicesMap, BusStop, BusStopsMap, RouteShapePoint, UniqueStop } from '@/types';

interface RawDataPayload {
  adjancencyList: AdjacencyList;
  stopsMap: Record<string, BusStop>;
  busServices: Record<string, BusService>;
  uniqueStops: UniqueStop[];
}

type RawRouteShapes = Record<string, RouteShapePoint[]>;

export interface LoadedData {
  graph: AdjacencyList;
  busStopsMap: BusStopsMap;
  busServices: BusServicesMap;
  uniqueStops: UniqueStop[];
}

export class DataLoadError extends Data.TaggedError('DataLoadError')<{
  url: string;
  reason: string;
}> {}

const fetchJson = <T>(url: string, signal?: AbortSignal): Effect.Effect<T, DataLoadError> =>
  Effect.tryPromise({
    try: async () => {
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new DataLoadError({ url, reason: `Failed to fetch (${response.status})` });
      }

      return (await response.json()) as T;
    },
    catch: (error) => {
      if (error instanceof DataLoadError) {
        return error;
      }

      return new DataLoadError({
        url,
        reason: error instanceof Error ? error.message : 'Unknown data load error',
      });
    },
  });

const normalizeStopsMap = (rawStopsMap: Record<string, BusStop>): BusStopsMap => {
  return Object.entries(rawStopsMap).reduce<BusStopsMap>((accumulator, [stopId, stop]) => {
    accumulator[Number(stopId)] = stop;
    return accumulator;
  }, {});
};

const normalizeBusServices = (
  rawBusServices: Record<string, BusService>,
  rawRouteShapes: RawRouteShapes,
): BusServicesMap => {
  return Object.entries(rawBusServices).reduce<BusServicesMap>((accumulator, [key, service]) => {
    accumulator[key] = {
      ...service,
      service_no: Number(service.service_no),
      shape: rawRouteShapes[String(service.service_no)] ?? rawRouteShapes[key],
    };
    return accumulator;
  }, {});
};

export const loadStaticData = (signal?: AbortSignal): Effect.Effect<LoadedData, DataLoadError> =>
  Effect.gen(function* () {
    const [adjancencyList, stopsMap, busServices, uniqueStops, routeShapes] = yield* Effect.all([
      fetchJson<RawDataPayload['adjancencyList']>('/data/adjancencyList.json', signal),
      fetchJson<RawDataPayload['stopsMap']>('/data/stops_map.json', signal),
      fetchJson<RawDataPayload['busServices']>('/data/bus_services.json', signal),
      fetchJson<RawDataPayload['uniqueStops']>('/data/unique_stops.json', signal),
      fetchJson<RawRouteShapes>('/data/route_shapes.json', signal),
    ]);

    return {
      graph: adjancencyList,
      busStopsMap: normalizeStopsMap(stopsMap),
      busServices: normalizeBusServices(busServices, routeShapes),
      uniqueStops,
    };
  });

export const formatDataLoadError = (error: DataLoadError): string => `${error.url}: ${error.reason}`;
