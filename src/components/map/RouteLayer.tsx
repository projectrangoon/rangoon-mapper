import type { Feature, FeatureCollection, LineString } from 'geojson';
import { Layer, Source } from 'react-map-gl/maplibre';

import type { BusService, BusServicesMap, BusStop, RoutePath, RouteStep } from '@/types';

interface RouteLayerProps {
  routePath: RoutePath | null;
  startStop: BusStop | null;
  endStop: BusStop | null;
  busServices: BusServicesMap;
}

interface RouteProperties {
  color: string;
  walk: boolean;
}

const toFeature = (coords: [number, number][], color: string, walk: boolean): Feature<LineString, RouteProperties> => ({
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: coords,
  },
  properties: {
    color,
    walk,
  },
});

const getCoordinatesFromSteps = (steps: RouteStep[]): [number, number][] => {
  return steps.flatMap((step) => {
    if (typeof step.lng !== 'number' || typeof step.lat !== 'number') {
      return [];
    }

    return [[step.lng, step.lat] as [number, number]];
  });
};

const getServiceRunCoordinates = (
  service: BusService | undefined,
  runSteps: RouteStep[],
): [number, number][] => {
  const fallbackCoordinates = getCoordinatesFromSteps(runSteps);
  const first = runSteps[0];
  const last = runSteps[runSteps.length - 1];
  if (!service || !first || !last) {
    return fallbackCoordinates;
  }

  const startIndex = service.stops.findIndex((stop) => stop.bus_stop_id === first.bus_stop_id);
  const endIndex = service.stops.findIndex((stop) => stop.bus_stop_id === last.bus_stop_id);
  if (startIndex === -1 || endIndex === -1) {
    return fallbackCoordinates;
  }

  const lowerIndex = Math.min(startIndex, endIndex);
  const upperIndex = Math.max(startIndex, endIndex);
  const slicedStops = service.stops.slice(lowerIndex, upperIndex + 1);
  const coordinates = slicedStops.map((stop) => [stop.lng, stop.lat] as [number, number]);
  return startIndex <= endIndex ? coordinates : coordinates.reverse();
};

export const buildRouteFeatures = (
  routePath: RoutePath | null,
  startStop: BusStop | null,
  endStop: BusStop | null,
  busServices: BusServicesMap,
): FeatureCollection<LineString, RouteProperties> => {
  if (!routePath || routePath.path.length === 0) {
    return { type: 'FeatureCollection', features: [] };
  }

  const features: Feature<LineString, RouteProperties>[] = [];
  let runStartIndex = -1;

  for (let index = 0; index <= routePath.path.length; index += 1) {
    const step = routePath.path[index];
    const previous = routePath.path[index - 1];
    const isBusStep = Boolean(step && step.service_name > 0);
    const serviceChanged = Boolean(step && previous && step.service_name !== previous.service_name);

    if (isBusStep && runStartIndex === -1) {
      runStartIndex = index;
    }

    const shouldFlushRun = runStartIndex !== -1 && (!isBusStep || serviceChanged || index === routePath.path.length);
    if (!shouldFlushRun) {
      continue;
    }

    const runEndIndex = serviceChanged ? index - 1 : index - 1;
    const runSteps = routePath.path.slice(runStartIndex, runEndIndex + 1);
    const serviceName = runSteps[0]?.service_name;
    const coordinates = getServiceRunCoordinates(busServices[String(serviceName ?? '')], runSteps);

    if (coordinates.length >= 2) {
      features.push(
        toFeature(
          coordinates,
          runSteps[0]?.color ?? '#42f5dd',
          false,
        ),
      );
    }

    runStartIndex = isBusStep ? index : -1;
  }

  const first = routePath.path[0];
  if (startStop && first && startStop.bus_stop_id !== first.bus_stop_id && typeof first.lng === 'number' && typeof first.lat === 'number') {
    features.unshift(
      toFeature(
        [
          [startStop.lng, startStop.lat],
          [first.lng, first.lat],
        ],
        '#f0f0f0',
        true,
      ),
    );
  }

  const last = routePath.path[routePath.path.length - 1];
  if (endStop && last && endStop.bus_stop_id !== last.bus_stop_id && typeof last.lng === 'number' && typeof last.lat === 'number') {
    features.push(
      toFeature(
        [
          [last.lng, last.lat],
          [endStop.lng, endStop.lat],
        ],
        '#f0f0f0',
        true,
      ),
    );
  }

  return {
    type: 'FeatureCollection',
    features,
  };
};

export default function RouteLayer({ routePath, startStop, endStop, busServices }: RouteLayerProps) {
  const data = buildRouteFeatures(routePath, startStop, endStop, busServices);

  if (data.features.length === 0) {
    return null;
  }

  return (
    <Source id="route-layer" type="geojson" data={data}>
      <Layer
        id="route-walk"
        type="line"
        filter={['==', ['get', 'walk'], true]}
        paint={{
          'line-color': ['get', 'color'],
          'line-width': 3,
          'line-dasharray': [1, 2],
          'line-opacity': 0.9,
        }}
      />
      <Layer
        id="route-bus"
        type="line"
        filter={['==', ['get', 'walk'], false]}
        paint={{
          'line-color': ['get', 'color'],
          'line-width': 4,
          'line-opacity': 0.95,
        }}
      />
    </Source>
  );
}
