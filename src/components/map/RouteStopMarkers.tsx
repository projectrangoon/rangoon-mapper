import type { CSSProperties } from 'react';
import { Marker } from 'react-map-gl/maplibre';

import type { BusStop, RoutePath } from '@/types';

interface RouteStopMarkersProps {
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
  name: string;
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
      name: step.name_en ?? String(step.bus_stop_id),
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

const checkpointLabel = (point: RouteStopPoint): string | null => {
  if (point.kind === 'board') {
    return `Board YBS ${point.serviceName}`;
  }
  if (point.kind === 'transfer' && point.nextServiceName) {
    return `Transfer ${point.serviceName} → ${point.nextServiceName}`;
  }
  if (point.kind === 'alight') {
    return `Exit YBS ${point.serviceName}`;
  }
  return null;
};

export default function RouteStopMarkers({ routePath, startStop, endStop, zoom }: RouteStopMarkersProps) {
  if (!shouldShowRouteStopMarkers(zoom)) {
    return null;
  }

  const points = buildRouteStopPoints(routePath).filter((point) => {
    if (point.kind === 'transfer') {
      return true;
    }

    return point.busStopId !== startStop?.bus_stop_id && point.busStopId !== endStop?.bus_stop_id;
  });

  return (
    <>
      {points.map((point) => {
        const label = checkpointLabel(point);
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
                <div className="route-stop-label">
                  <small>{label}</small>
                  <strong>{point.name}</strong>
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
