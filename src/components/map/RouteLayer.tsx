import type { Feature, FeatureCollection, LineString } from 'geojson';
import { Layer, Source } from 'react-map-gl/maplibre';

import type { BusStop, RoutePath } from '@/types';

interface RouteLayerProps {
  routePath: RoutePath | null;
  startStop: BusStop | null;
  endStop: BusStop | null;
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

const buildFeatures = (routePath: RoutePath | null, startStop: BusStop | null, endStop: BusStop | null): FeatureCollection<LineString, RouteProperties> => {
  if (!routePath || routePath.path.length === 0) {
    return { type: 'FeatureCollection', features: [] };
  }

  const features: Feature<LineString, RouteProperties>[] = [];

  for (let index = 0; index < routePath.path.length - 1; index += 1) {
    const from = routePath.path[index];
    const to = routePath.path[index + 1];

    if (!from || !to || typeof from.lng !== 'number' || typeof from.lat !== 'number' || typeof to.lng !== 'number' || typeof to.lat !== 'number') {
      continue;
    }

    const walk = from.walk === true || to.walk === true || from.service_name === 0 || to.service_name === 0;
    features.push(toFeature(
      [
        [from.lng, from.lat],
        [to.lng, to.lat],
      ],
      walk ? '#f0f0f0' : from.color ?? '#42f5dd',
      walk,
    ));
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

export default function RouteLayer({ routePath, startStop, endStop }: RouteLayerProps) {
  const data = buildFeatures(routePath, startStop, endStop);

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
