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
const MAX_SHAPE_START_CANDIDATES = 12;

interface ShapeMatch {
  coordinates: [number, number][];
  totalDistanceKm: number;
  span: number;
}

interface ShapeCandidate {
  index: number;
  distanceKm: number;
}

interface ShapeMatchState {
  index: number;
  distanceKm: number;
  totalDistanceKm: number;
  previous: ShapeMatchState | null;
  step: RouteStep;
}

const getRunSpanLimit = (
  service: BusService | undefined,
  runSteps: RouteStep[],
): number | null => {
  if (!service || runSteps.length < 2 || service.stops.length < 2) {
    return null;
  }

  const firstStopId = runSteps[0]?.bus_stop_id;
  const lastStopId = runSteps[runSteps.length - 1]?.bus_stop_id;
  if (typeof firstStopId !== 'number' || typeof lastStopId !== 'number') {
    return null;
  }

  const startIndices = service.stops
    .map((stop, index) => (stop.bus_stop_id === firstStopId ? index : -1))
    .filter((index) => index !== -1);
  const endIndices = service.stops
    .map((stop, index) => (stop.bus_stop_id === lastStopId ? index : -1))
    .filter((index) => index !== -1);

  if (startIndices.length === 0 || endIndices.length === 0) {
    return null;
  }

  const isCircularService = service.stops[0]?.bus_stop_id === service.stops[service.stops.length - 1]?.bus_stop_id;
  let bestSpan = Number.POSITIVE_INFINITY;

  startIndices.forEach((startIndex) => {
    endIndices.forEach((endIndex) => {
      if (endIndex >= startIndex) {
        bestSpan = Math.min(bestSpan, endIndex - startIndex);
        return;
      }

      if (isCircularService) {
        bestSpan = Math.min(bestSpan, service.stops.length - startIndex + endIndex);
      }
    });
  });

  if (!Number.isFinite(bestSpan)) {
    return null;
  }

  return Math.max(bestSpan * 2 + 4, runSteps.length + 4);
};

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

const appendCoordinate = (
  coordinates: [number, number][],
  coordinate: [number, number],
) => {
  const lastCoordinate = coordinates[coordinates.length - 1];
  if (lastCoordinate && lastCoordinate[0] === coordinate[0] && lastCoordinate[1] === coordinate[1]) {
    return;
  }

  coordinates.push(coordinate);
};

const getShapePointCandidates = (
  shapeCoordinates: [number, number][],
  step: RouteStep | undefined,
  startIndex = 0,
): ShapeCandidate[] => {
  if (
    !step ||
    typeof step.lng !== 'number' ||
    typeof step.lat !== 'number' ||
    shapeCoordinates.length === 0 ||
    startIndex >= shapeCoordinates.length
  ) {
    return [];
  }

  const candidates: ShapeCandidate[] = [];

  shapeCoordinates.slice(startIndex).forEach(([lng, lat], offset) => {
    const index = startIndex + offset;
    const distance = getDistance(step.lat!, step.lng!, lat, lng);
    if (distance <= SHAPE_MATCH_DISTANCE_KM) {
      candidates.push({ index, distanceKm: distance });
    }
  });

  return candidates;
};

const getShapeStartCandidates = (
  shapeCoordinates: [number, number][],
  step: RouteStep | undefined,
): Array<{ index: number; distanceKm: number }> => {
  if (!step || typeof step.lng !== 'number' || typeof step.lat !== 'number') {
    return [];
  }

  return shapeCoordinates
    .map(([lng, lat], index) => ({
      index,
      distanceKm: getDistance(step.lat!, step.lng!, lat, lng),
    }))
    .filter((candidate) => candidate.distanceKm <= SHAPE_MATCH_DISTANCE_KM)
    .sort((left, right) => {
      if (left.distanceKm === right.distanceKm) {
        return left.index - right.index;
      }

      return left.distanceKm - right.distanceKm;
    })
    .slice(0, MAX_SHAPE_START_CANDIDATES);
};

const matchShapeRun = (
  shapeCoordinates: [number, number][],
  runSteps: RouteStep[],
  maxSpan?: number,
): ShapeMatch | null => {
  if (runSteps.length === 0 || shapeCoordinates.length < 2) {
    return null;
  }

  const startCandidates = getShapeStartCandidates(shapeCoordinates, runSteps[0]);
  if (startCandidates.length === 0) {
    return null;
  }

  let bestMatch: ShapeMatch | null = null;

  startCandidates.forEach((startCandidate) => {
    let states: ShapeMatchState[] = [{
      index: startCandidate.index,
      distanceKm: startCandidate.distanceKm,
      totalDistanceKm: startCandidate.distanceKm,
      previous: null,
      step: runSteps[0]!,
    }];

    for (let index = 1; index < runSteps.length; index += 1) {
      const step = runSteps[index];
      const nextStatesByIndex = new Map<number, ShapeMatchState>();

      states.forEach((state) => {
        const stepCandidates = getShapePointCandidates(shapeCoordinates, step, state.index);

        stepCandidates.forEach((candidate) => {
          const span = candidate.index - startCandidate.index;
          if (typeof maxSpan === 'number' && span > maxSpan) {
            return;
          }

          const totalDistanceKm = state.totalDistanceKm + candidate.distanceKm;
          const existing = nextStatesByIndex.get(candidate.index);
          if (existing && existing.totalDistanceKm <= totalDistanceKm) {
            return;
          }

          nextStatesByIndex.set(candidate.index, {
            index: candidate.index,
            distanceKm: candidate.distanceKm,
            totalDistanceKm,
            previous: state,
            step: step!,
          });
        });
      });

      states = Array.from(nextStatesByIndex.values()).sort((left, right) => left.index - right.index);
      if (states.length === 0) {
        return;
      }
    }

    const bestEndState = states.reduce<ShapeMatchState | null>((currentBest, candidate) => {
      if (!currentBest) {
        return candidate;
      }

      const candidateSpan = candidate.index - startCandidate.index;
      const bestSpan = currentBest.index - startCandidate.index;
      if (candidate.totalDistanceKm < currentBest.totalDistanceKm) {
        return candidate;
      }

      if (candidate.totalDistanceKm === currentBest.totalDistanceKm && candidateSpan < bestSpan) {
        return candidate;
      }

      return currentBest;
    }, null);

    if (!bestEndState) {
      return;
    }

    const matches: Array<{ index: number; step: RouteStep; distanceKm: number }> = [];
    let currentState: ShapeMatchState | null = bestEndState;
    while (currentState) {
      matches.push({
        index: currentState.index,
        step: currentState.step,
        distanceKm: currentState.distanceKm,
      });
      currentState = currentState.previous;
    }
    matches.reverse();

    if (matches.length < 2) {
      return;
    }

    const span = matches[matches.length - 1]!.index - matches[0]!.index;
    if (typeof maxSpan === 'number' && span > maxSpan) {
      return;
    }

    const anchoredShape: [number, number][] = [];
    const firstStep = matches[0]!.step;
    if (typeof firstStep.lng !== 'number' || typeof firstStep.lat !== 'number') {
      return;
    }

    appendCoordinate(anchoredShape, [firstStep.lng, firstStep.lat]);

    for (let index = 1; index < matches.length; index += 1) {
      const previousMatch = matches[index - 1]!;
      const currentMatch = matches[index]!;

      if (currentMatch.index > previousMatch.index) {
        shapeCoordinates
          .slice(previousMatch.index + 1, currentMatch.index)
          .forEach((shapeCoordinate) => appendCoordinate(anchoredShape, shapeCoordinate));
      }

      if (typeof currentMatch.step.lng !== 'number' || typeof currentMatch.step.lat !== 'number') {
        return;
      }

      appendCoordinate(anchoredShape, [currentMatch.step.lng, currentMatch.step.lat]);
    }

    if (anchoredShape.length < 2) {
      return;
    }

    const totalDistanceKm = matches.reduce((sum, match) => sum + match.distanceKm, 0);
    const candidateMatch: ShapeMatch = {
      coordinates: anchoredShape,
      totalDistanceKm,
      span,
    };

    if (
      !bestMatch ||
      candidateMatch.totalDistanceKm < bestMatch.totalDistanceKm ||
      (
        candidateMatch.totalDistanceKm === bestMatch.totalDistanceKm &&
        candidateMatch.span < bestMatch.span
      )
    ) {
      bestMatch = candidateMatch;
    }
  });

  return bestMatch;
};

const getAnchoredShapeRunCoordinates = (
  service: BusService | undefined,
  runSteps: RouteStep[],
): [number, number][] | null => {
  const shapeCoordinates = service?.shape?.map((point) => [point.lng, point.lat] as [number, number]) ?? [];
  if (!service || runSteps.length === 0 || shapeCoordinates.length < 2) {
    return null;
  }

  const reversedShapeCoordinates = [...shapeCoordinates].reverse();
  const isCircularService = service.stops[0]?.bus_stop_id === service.stops[service.stops.length - 1]?.bus_stop_id;
  const constrainedSpanLimit = getRunSpanLimit(service, runSteps);
  const variants: Array<{ coordinates: [number, number][]; maxSpan?: number }> = [
    { coordinates: shapeCoordinates },
    { coordinates: reversedShapeCoordinates },
  ];

  if (isCircularService) {
    variants.push({
      coordinates: shapeCoordinates.concat(shapeCoordinates),
      maxSpan: shapeCoordinates.length,
    });
    variants.push({
      coordinates: reversedShapeCoordinates.concat(reversedShapeCoordinates),
      maxSpan: reversedShapeCoordinates.length,
    });
  }

  const pickBestMatch = (useConstrainedLimit: boolean) => variants.reduce<ShapeMatch | null>((currentBest, variant) => {
    const maxSpan = useConstrainedLimit
      ? Math.min(
        variant.maxSpan ?? Number.POSITIVE_INFINITY,
        constrainedSpanLimit ?? Number.POSITIVE_INFINITY,
      )
      : variant.maxSpan;
    const candidate = matchShapeRun(variant.coordinates, runSteps, variant.maxSpan);
    const constrainedCandidate = typeof maxSpan === 'number' && Number.isFinite(maxSpan)
      ? matchShapeRun(variant.coordinates, runSteps, maxSpan)
      : candidate;
    const selectedCandidate = useConstrainedLimit ? constrainedCandidate : candidate;
    if (!selectedCandidate) {
      return currentBest;
    }

    if (
      !currentBest ||
      selectedCandidate.totalDistanceKm < currentBest.totalDistanceKm ||
      (selectedCandidate.totalDistanceKm === currentBest.totalDistanceKm && selectedCandidate.span < currentBest.span)
    ) {
      return selectedCandidate;
    }

    return currentBest;
  }, null);

  const bestMatch = pickBestMatch(true) ?? pickBestMatch(false);

  return bestMatch?.coordinates ?? null;
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
