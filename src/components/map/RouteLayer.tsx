import type { Feature, FeatureCollection, LineString } from 'geojson';
import { Layer, Source } from 'react-map-gl/maplibre';

import { getDistance } from '@/lib/geo';
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

const WALK_COLOR = '#2f343d';
const SHAPE_MATCH_DISTANCE_KM = 1.5;

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

const findNearestShapePointIndex = (
  shapeCoordinates: [number, number][],
  step: RouteStep | undefined,
  startIndex = 0,
): { index: number; distanceKm: number } | null => {
  if (
    !step ||
    typeof step.lng !== 'number' ||
    typeof step.lat !== 'number' ||
    shapeCoordinates.length === 0 ||
    startIndex >= shapeCoordinates.length
  ) {
    return null;
  }

  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;

  shapeCoordinates.slice(startIndex).forEach(([lng, lat], offset) => {
    const index = startIndex + offset;
    const distance = getDistance(step.lat!, step.lng!, lat, lng);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  if (bestIndex === -1) {
    return null;
  }

  return { index: bestIndex, distanceKm: bestDistance };
};

const getAnchoredShapeRunCoordinates = (
  service: BusService | undefined,
  runSteps: RouteStep[],
): [number, number][] | null => {
  const shapeCoordinates = service?.shape?.map((point) => [point.lng, point.lat] as [number, number]) ?? [];
  if (!service || runSteps.length === 0 || shapeCoordinates.length < 2) {
    return null;
  }

  const matches: Array<{ index: number; step: RouteStep }> = [];
  let searchStartIndex = 0;

  for (const step of runSteps) {
    const match = findNearestShapePointIndex(shapeCoordinates, step, searchStartIndex);
    if (!match || match.distanceKm > SHAPE_MATCH_DISTANCE_KM) {
      return null;
    }

    matches.push({ index: match.index, step });
    searchStartIndex = match.index;
  }

  const startIndex = matches[0]!.index;
  const endIndex = matches[matches.length - 1]!.index;
  if (startIndex === endIndex) {
    return null;
  }

  const anchoredShape = shapeCoordinates.slice(startIndex, endIndex + 1);

  matches.forEach(({ index, step }) => {
    if (typeof step.lng !== 'number' || typeof step.lat !== 'number') {
      return;
    }

    anchoredShape[index - startIndex] = [step.lng, step.lat];
  });

  return anchoredShape;
};

const getServiceRunCoordinates = (
  service: BusService | undefined,
  runSteps: RouteStep[],
): [number, number][] => {
  const shapeCoordinates = getAnchoredShapeRunCoordinates(service, runSteps);
  if (shapeCoordinates && shapeCoordinates.length >= 2) {
    return shapeCoordinates;
  }

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
        WALK_COLOR,
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
        WALK_COLOR,
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
        id="route-walk-casing"
        type="line"
        filter={['==', ['get', 'walk'], true]}
        layout={{
          'line-cap': 'round',
          'line-join': 'round',
        }}
        paint={{
          'line-color': 'rgba(255, 255, 255, 0.92)',
          'line-width': 7,
          'line-opacity': 0.95,
        }}
      />
      <Layer
        id="route-walk"
        type="line"
        filter={['==', ['get', 'walk'], true]}
        layout={{
          'line-cap': 'round',
          'line-join': 'round',
        }}
        paint={{
          'line-color': ['get', 'color'],
          'line-width': 3.4,
          'line-dasharray': [0.8, 1.6],
          'line-opacity': 1,
        }}
      />
      <Layer
        id="route-bus-casing"
        type="line"
        filter={['==', ['get', 'walk'], false]}
        layout={{
          'line-cap': 'round',
          'line-join': 'round',
        }}
        paint={{
          'line-color': 'rgba(255, 255, 255, 0.82)',
          'line-width': 6,
          'line-opacity': 0.9,
        }}
      />
      <Layer
        id="route-bus"
        type="line"
        filter={['==', ['get', 'walk'], false]}
        layout={{
          'line-cap': 'round',
          'line-join': 'round',
        }}
        paint={{
          'line-color': ['get', 'color'],
          'line-width': 4,
          'line-opacity': 0.95,
        }}
      />
    </Source>
  );
}
