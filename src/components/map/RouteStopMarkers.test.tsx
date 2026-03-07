import {
  ROUTE_STOP_MARKER_ZOOM,
  buildRouteStopPoints,
  getVisibleRouteStopPoints,
  shouldShowRouteStopMarkers,
} from '@/components/map/RouteStopMarkers';
import type { BusStop, RoutePath } from '@/types';

const startStop: BusStop = {
  bus_stop_id: 10,
  lat: 16.9,
  lng: 96.1,
  name_en: 'Board',
  name_mm: 'အစ',
  road_en: 'Road 1',
  road_mm: 'လမ်း ၁',
  township_en: 'Township',
  township_mm: 'မြို့နယ်',
  services: [{ service_name: 18, color: '#d65252', sequence: 1 }],
};

const endStop: BusStop = {
  ...startStop,
  bus_stop_id: 14,
  lat: 16.904,
  lng: 96.104,
  name_en: 'Exit',
  services: [{ service_name: 59, color: '#334f9b', sequence: 1 }],
};

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

  it('keeps transfer checkpoints visible even when zoomed out', () => {
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

    const lowZoomPoints = getVisibleRouteStopPoints(
      routePath,
      startStop,
      endStop,
      ROUTE_STOP_MARKER_ZOOM - 1,
    );
    const highZoomPoints = getVisibleRouteStopPoints(routePath, startStop, endStop, ROUTE_STOP_MARKER_ZOOM);

    expect(lowZoomPoints).toHaveLength(1);
    expect(lowZoomPoints[0]).toMatchObject({
      busStopId: 12,
      kind: 'transfer',
      serviceName: 18,
      nextServiceName: 59,
    });
    expect(highZoomPoints.map((point) => point.kind)).toEqual(['pass', 'transfer', 'pass']);
  });

  it('hides boarded and alighted route-stop markers when they duplicate the selected endpoints', () => {
    const selectedStart: BusStop = {
      ...startStop,
      bus_stop_id: 121,
      lat: 16.774918,
      lng: 96.142353,
      name_en: 'Maw Tin',
    };
    const boardedStop = {
      bus_stop_id: 122,
      service_name: 39,
      lat: 16.774622,
      lng: 96.142243,
      name_en: 'Maw Tin',
      color: '#405CAA',
    };
    const midStop = {
      bus_stop_id: 123,
      service_name: 39,
      lat: 16.78,
      lng: 96.15,
      name_en: 'Sanpya',
      color: '#405CAA',
    };
    const alightedStop = {
      bus_stop_id: 44,
      service_name: 39,
      lat: 16.904243,
      lng: 96.097559,
      name_en: 'Japan Lan',
      color: '#405CAA',
    };
    const selectedEnd: BusStop = {
      ...endStop,
      bus_stop_id: 43,
      lat: 16.903832,
      lng: 96.097151,
      name_en: 'Japan Lan',
    };
    const routePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 0,
      path: [boardedStop, midStop, alightedStop],
    };

    const points = getVisibleRouteStopPoints(
      routePath,
      selectedStart,
      selectedEnd,
      ROUTE_STOP_MARKER_ZOOM + 1,
    );

    expect(points.map((point) => point.busStopId)).toEqual([123]);
  });

  it('keeps transfer markers visible even when they are close to an endpoint', () => {
    const selectedStart: BusStop = {
      ...startStop,
      bus_stop_id: 1,
      lat: 16.8,
      lng: 96.1,
      name_en: 'Start',
    };
    const selectedEnd: BusStop = {
      ...endStop,
      bus_stop_id: 2,
      lat: 16.9,
      lng: 96.2,
      name_en: 'End',
    };
    const transferStop = {
      bus_stop_id: 3,
      service_name: 1,
      lat: 16.90005,
      lng: 96.20005,
      name_en: 'End',
      color: '#405CAA',
    };
    const routePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 1,
      path: [
        { bus_stop_id: 1, service_name: 1, lat: 16.8, lng: 96.1, name_en: 'Start', color: '#405CAA' },
        transferStop,
        { ...transferStop, service_name: 2, color: '#86603E' },
      ],
    };

    const points = getVisibleRouteStopPoints(
      routePath,
      selectedStart,
      selectedEnd,
      ROUTE_STOP_MARKER_ZOOM + 1,
    );

    expect(points).toHaveLength(1);
    expect(points[0]).toMatchObject({ kind: 'transfer' });
  });
});
