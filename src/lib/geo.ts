import type { BusServiceRef, BusStop, BusStopsMap, RoutePath, RouteStep } from '@/types';

const EARTH_RADIUS_KM = 6367;

const toBusStopsArray = (busStopsMap: BusStopsMap | BusStop[]): BusStop[] =>
  Array.isArray(busStopsMap) ? busStopsMap : Object.values(busStopsMap);

export const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

export const getDistance = (lat1Deg: number, lng1Deg: number, lat2Deg: number, lng2Deg: number): number => {
  const lat1 = toRadians(lat1Deg);
  const lng1 = toRadians(lng1Deg);
  const lat2 = toRadians(lat2Deg);
  const lng2 = toRadians(lng2Deg);
  const dlon = lng2 - lng1;
  const dlat = lat2 - lat1;
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dlon / 2) ** 2);
  const c = 2 * Math.asin(Math.sqrt(a));
  return EARTH_RADIUS_KM * c;
};

const flattenServices = (
  busStop: BusStop,
  stop?: Pick<BusStop, 'lat' | 'lng'>,
): Array<Omit<BusStop, 'services'> & { service_name: number; color: string; sequence: number; distance?: number }> => {
  const base = {
    lng: busStop.lng,
    lat: busStop.lat,
    name_en: busStop.name_en,
    name_mm: busStop.name_mm,
    road_mm: busStop.road_mm,
    road_en: busStop.road_en,
    bus_stop_id: busStop.bus_stop_id,
    township_en: busStop.township_en,
    township_mm: busStop.township_mm,
    distance: stop ? getDistance(busStop.lat, busStop.lng, stop.lat, stop.lng) : undefined,
  };

  return busStop.services.map((service: BusServiceRef) => ({
    ...base,
    service_name: service.service_name,
    color: service.color,
    sequence: service.sequence,
  }));
};

const resolveStop = (busStops: BusStop[], stop: Pick<BusStop, 'bus_stop_id'> & Partial<Pick<BusStop, 'lat' | 'lng'>>): BusStop | null => {
  if (typeof stop.lat === 'number' && typeof stop.lng === 'number') {
    return stop as BusStop;
  }
  return busStops.find((candidate) => candidate.bus_stop_id === stop.bus_stop_id) ?? null;
};

export const getNearbyStops = (
  busStopsMap: BusStopsMap | BusStop[],
  stopInput: Pick<BusStop, 'bus_stop_id'> & Partial<Pick<BusStop, 'lat' | 'lng'>>,
  radius = 0.5,
): Array<Omit<BusStop, 'services'> & { service_name: number; color: string; sequence: number; distance?: number }> => {
  const busStops = toBusStopsArray(busStopsMap);
  const stop = resolveStop(busStops, stopInput);

  if (!stop) {
    return [];
  }

  const deltaLat = radius / 110.567;
  const maximalLat = stop.lat + deltaLat;
  const minimalLat = stop.lat - deltaLat;

  // Keep historical computation to preserve legacy behavior.
  const maxDeltaLng = Math.cos(maximalLat) * (radius / 111.321);
  const minDeltaLng = Math.cos(minimalLat) * (radius / 111.321);
  const maximalLng = stop.lng - maxDeltaLng;
  const minimalLng = stop.lng + minDeltaLng;

  const stops = busStops.filter((busStop) => {
    return (
      busStop.lat !== stop.lat &&
      busStop.lng !== stop.lng &&
      minimalLat < busStop.lat &&
      busStop.lat < maximalLat &&
      minimalLng < busStop.lng &&
      busStop.lng < maximalLng
    );
  });

  return stops.flatMap((busStop) => flattenServices(busStop, stop));
};

export const getStopsObjects = (busStopsMap: BusStopsMap, routePath: RoutePath): RoutePath => {
  const enrichedPath = routePath.path.map((routeStop) => {
    const sourceStop = busStopsMap[routeStop.bus_stop_id];
    if (!sourceStop) {
      return routeStop;
    }

    const serviceMatch = sourceStop.services.find((service) => service.service_name === routeStop.service_name);
    const color = routeStop.service_name === 0 ? '#ffffff' : serviceMatch?.color ?? '#ffffff';

    return {
      ...sourceStop,
      service_name: routeStop.service_name,
      walk: routeStop.walk,
      distance: routeStop.distance,
      color,
    };
  });

  if (routePath.currTransfers <= 0) {
    return {
      ...routePath,
      path: enrichedPath,
    };
  }

  const finalPath: RouteStep[] = [enrichedPath[0]].filter(Boolean) as RouteStep[];

  for (let index = 1; index < enrichedPath.length; index += 1) {
    const current = enrichedPath[index];
    const previous = enrichedPath[index - 1];

    if (!current || !previous) {
      continue;
    }

    if (current.service_name !== previous.service_name) {
      finalPath.push({
        ...current,
        service_name: previous.service_name,
        color: previous.color,
      });
    }

    finalPath.push(current);
  }

  return {
    ...routePath,
    path: finalPath,
  };
};

export const groupBy = <T>(items: T[], key: keyof T | ((item: T) => string | number)): T[][] => {
  const groups = items.reduce<Array<{ key: string | number; values: T[] }>>((accumulator, item) => {
    const groupKey = typeof key === 'function' ? key(item) : (item[key] as string | number);
    const existing = accumulator.find((entry) => entry.key === groupKey);

    if (existing) {
      existing.values.push(item);
      return accumulator;
    }

    accumulator.push({ key: groupKey, values: [item] });
    return accumulator;
  }, []);

  return groups.map((group) => group.values);
};
