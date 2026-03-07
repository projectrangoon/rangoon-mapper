import type { CSSProperties } from 'react';
import { Marker } from 'react-map-gl/maplibre';

import { getDistance } from '@/lib/geo';
import {
  formatBoardLabel,
  formatExitLabel,
  formatTransferLabel,
  getLocalizedName,
} from '@/lib/i18n';
import type { AppLocale, BusStop, RoutePath } from '@/types';

interface RouteStopMarkersProps {
  locale: AppLocale;
  routePath: RoutePath | null;
  startStop: BusStop | null;
  endStop: BusStop | null;
  zoom: number;
}

type RouteStopKind = 'pass' | 'board' | 'transfer' | 'alight';

interface RouteStopPoint {
  key: string;
  busStopId: number;
  lat: number;
  lng: number;
  nameEn: string;
  nameMm: string;
  serviceName: number;
  nextServiceName?: number;
  kind: RouteStopKind;
  color: string;
}

const kindPriority: Record<RouteStopKind, number> = {
  pass: 0,
  board: 1,
  alight: 1,
  transfer: 2,
};

export const ROUTE_STOP_MARKER_ZOOM = 13.25;
const ENDPOINT_DUPLICATE_DISTANCE_KM = 0.12;

const collapseConsecutiveStops = (routePath: RoutePath): RouteStopPoint[] => {
  const points: RouteStopPoint[] = [];

  routePath.path.forEach((step, index) => {
    if (
      step.service_name <= 0 ||
      typeof step.lat !== 'number' ||
      typeof step.lng !== 'number'
    ) {
      return;
    }

    const previous = routePath.path[index - 1];
    const next = routePath.path[index + 1];

    let kind: RouteStopKind = 'pass';
    if (!previous || previous.service_name === 0) {
      kind = 'board';
    } else if (previous.service_name > 0 && previous.service_name !== step.service_name) {
      kind = 'transfer';
    } else if (!next || next.service_name === 0) {
      kind = 'alight';
    }

    const candidate: RouteStopPoint = {
      key: `${step.bus_stop_id}-${index}`,
      busStopId: step.bus_stop_id,
      lat: step.lat,
      lng: step.lng,
      nameEn: step.name_en ?? String(step.bus_stop_id),
      nameMm: step.name_mm ?? step.name_en ?? String(step.bus_stop_id),
      serviceName: step.service_name,
      kind,
      color: step.color ?? '#d65252',
    };

    const lastPoint = points[points.length - 1];
    if (lastPoint && lastPoint.busStopId === candidate.busStopId) {
      if (kindPriority[candidate.kind] >= kindPriority[lastPoint.kind]) {
        lastPoint.kind = candidate.kind;
        lastPoint.color = candidate.color;
        lastPoint.serviceName = previous?.service_name && previous.service_name > 0 && candidate.kind === 'transfer'
          ? previous.service_name
          : candidate.serviceName;
        lastPoint.nextServiceName = candidate.kind === 'transfer' ? candidate.serviceName : candidate.nextServiceName;
      }
      return;
    }

    if (candidate.kind === 'transfer') {
      candidate.serviceName = previous?.service_name && previous.service_name > 0 ? previous.service_name : candidate.serviceName;
      candidate.nextServiceName = step.service_name;
    }

    points.push(candidate);
  });

  return points;
};

export const buildRouteStopPoints = (routePath: RoutePath | null): RouteStopPoint[] => {
  if (!routePath || routePath.path.length === 0) {
    return [];
  }

  return collapseConsecutiveStops(routePath);
};

export const shouldShowRouteStopMarkers = (zoom: number): boolean => zoom >= ROUTE_STOP_MARKER_ZOOM;

export const getVisibleRouteStopPoints = (
  routePath: RoutePath | null,
  startStop: BusStop | null,
  endStop: BusStop | null,
  zoom: number,
): RouteStopPoint[] => {
  const matchesEndpoint = (point: RouteStopPoint, stop: BusStop | null): boolean => {
    if (!stop) {
      return false;
    }

    if (point.busStopId === stop.bus_stop_id) {
      return true;
    }

    if (point.nameEn !== stop.name_en && point.nameMm !== stop.name_mm) {
      return false;
    }

    return getDistance(point.lat, point.lng, stop.lat, stop.lng) <= ENDPOINT_DUPLICATE_DISTANCE_KM;
  };

  const points = buildRouteStopPoints(routePath).filter((point) => {
    if (point.kind === 'transfer') {
      return true;
    }

    return !matchesEndpoint(point, startStop) && !matchesEndpoint(point, endStop);
  });

  if (shouldShowRouteStopMarkers(zoom)) {
    return points;
  }

  return points.filter((point) => point.kind === 'transfer');
};

const checkpointLabel = (locale: AppLocale, point: RouteStopPoint): string | null => {
  if (point.kind === 'board') {
    return formatBoardLabel(locale, point.serviceName);
  }
  if (point.kind === 'transfer' && point.nextServiceName) {
    return formatTransferLabel(locale, point.serviceName, point.nextServiceName);
  }
  if (point.kind === 'alight') {
    return formatExitLabel(locale, point.serviceName);
  }
  return null;
};

export default function RouteStopMarkers({ locale, routePath, startStop, endStop, zoom }: RouteStopMarkersProps) {
  const points = getVisibleRouteStopPoints(routePath, startStop, endStop, zoom);

  if (points.length === 0) {
    return null;
  }

  return (
    <>
      {points.map((point) => {
        const label = checkpointLabel(locale, point);
        const emphasized = point.kind !== 'pass';

        return (
          <Marker
            key={point.key}
            latitude={point.lat}
            longitude={point.lng}
            anchor="center"
          >
            <div
              className={`route-stop route-stop-${point.kind}`}
              style={{ '--route-stop-accent': point.color } as CSSProperties}
            >
              {label && (
                <div className={`route-stop-label route-stop-label-${point.kind}`}>
                  <small>{label}</small>
                  <strong>{getLocalizedName({ name_en: point.nameEn, name_mm: point.nameMm }, locale)}</strong>
                </div>
              )}
              <span className={emphasized ? 'route-stop-dot route-stop-dot-emphasis' : 'route-stop-dot'} />
            </div>
          </Marker>
        );
      })}
    </>
  );
}
