import {
  ROUTE_STOP_MARKER_ZOOM,
  buildRouteStopPoints,
  shouldShowRouteStopMarkers,
} from '@/components/map/RouteStopMarkers';
import type { RoutePath } from '@/types';

describe('buildRouteStopPoints', () => {
  it('marks boarding, transfer, pass-through, and alighting stops for a transit route', () => {
    const routePath: RoutePath = {
      currCost: 12,
      currDistance: 7.2,
      currTransfers: 1,
      path: [
        { bus_stop_id: 10, service_name: 18, lat: 16.9, lng: 96.1, name_en: 'Board', color: '#d65252' },
        { bus_stop_id: 11, service_name: 18, lat: 16.901, lng: 96.101, name_en: 'Pass', color: '#d65252' },
        { bus_stop_id: 12, service_name: 18, lat: 16.902, lng: 96.102, name_en: 'Transfer', color: '#d65252' },
        { bus_stop_id: 12, service_name: 59, lat: 16.902, lng: 96.102, name_en: 'Transfer', color: '#334f9b' },
        { bus_stop_id: 13, service_name: 59, lat: 16.903, lng: 96.103, name_en: 'Ride On', color: '#334f9b' },
        { bus_stop_id: 14, service_name: 59, lat: 16.904, lng: 96.104, name_en: 'Exit', color: '#334f9b' },
      ],
    };

    const points = buildRouteStopPoints(routePath);

    expect(points).toHaveLength(5);
    expect(points[0]).toMatchObject({ busStopId: 10, kind: 'board', serviceName: 18 });
    expect(points[1]).toMatchObject({ busStopId: 11, kind: 'pass', serviceName: 18 });
    expect(points[2]).toMatchObject({ busStopId: 12, kind: 'transfer', serviceName: 18, nextServiceName: 59 });
    expect(points[3]).toMatchObject({ busStopId: 13, kind: 'pass', serviceName: 59 });
    expect(points[4]).toMatchObject({ busStopId: 14, kind: 'alight', serviceName: 59 });
  });

  it('returns no points for empty route data', () => {
    expect(buildRouteStopPoints(null)).toEqual([]);
  });

  it('only shows route stop markers once the map is sufficiently zoomed in', () => {
    expect(shouldShowRouteStopMarkers(ROUTE_STOP_MARKER_ZOOM - 0.1)).toBe(false);
    expect(shouldShowRouteStopMarkers(ROUTE_STOP_MARKER_ZOOM)).toBe(true);
    expect(shouldShowRouteStopMarkers(15)).toBe(true);
  });
});
