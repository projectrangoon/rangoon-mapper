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

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`);
  }
  return (await response.json()) as T;
};

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

export const loadStaticData = async (): Promise<LoadedData> => {
  const [adjancencyList, stopsMap, busServices, uniqueStops, routeShapes] = await Promise.all([
    fetchJson<RawDataPayload['adjancencyList']>('/data/adjancencyList.json'),
    fetchJson<RawDataPayload['stopsMap']>('/data/stops_map.json'),
    fetchJson<RawDataPayload['busServices']>('/data/bus_services.json'),
    fetchJson<RawDataPayload['uniqueStops']>('/data/unique_stops.json'),
    fetchJson<RawRouteShapes>('/data/route_shapes.json'),
  ]);

  return {
    graph: adjancencyList,
    busStopsMap: normalizeStopsMap(stopsMap),
    busServices: normalizeBusServices(busServices, routeShapes),
    uniqueStops,
  };
};
