import { buildRouteFeatures } from '@/components/map/RouteLayer';
import type { BusServicesMap, BusStop, RoutePath } from '@/types';

const startStop: BusStop = {
  bus_stop_id: 1,
  lat: 16.8,
  lng: 96.1,
  name_en: 'Start',
  name_mm: 'အစ',
  road_en: 'Road 1',
  road_mm: 'လမ်း ၁',
  township_en: 'Township',
  township_mm: 'မြို့နယ်',
  services: [{ service_name: 1, color: '#44ccaa', sequence: 1 }],
};

const midStop: BusStop = {
  ...startStop,
  bus_stop_id: 2,
  lat: 16.82,
  lng: 96.14,
  name_en: 'Mid',
  services: [{ service_name: 1, color: '#44ccaa', sequence: 2 }],
};

const endStop: BusStop = {
  ...startStop,
  bus_stop_id: 3,
  lat: 16.85,
  lng: 96.18,
  name_en: 'End',
  services: [{ service_name: 1, color: '#44ccaa', sequence: 3 }],
};

const busServices: BusServicesMap = {
  '1': {
    color: '#44ccaa',
    service_name: 'Service One',
    service_no: 1,
    stops: [
      {
        ...startStop,
        service_name: 1,
        color: '#44ccaa',
        sequence: 1,
        distance: 0.1,
      },
      {
        ...midStop,
        service_name: 1,
        color: '#44ccaa',
        sequence: 2,
        distance: 0.1,
      },
      {
        ...endStop,
        service_name: 1,
        color: '#44ccaa',
        sequence: 3,
        distance: 0.1,
      },
    ],
  },
};

describe('buildRouteFeatures', () => {
  it('uses the service shape geometry when available for bus legs', () => {
    const routePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 0,
      path: [
        { bus_stop_id: 1, service_name: 1, lat: startStop.lat, lng: startStop.lng, color: '#44ccaa' },
        { bus_stop_id: 3, service_name: 1, lat: endStop.lat, lng: endStop.lng, color: '#44ccaa' },
      ],
    };

    const shapedServices: BusServicesMap = {
      '1': {
        color: '#44ccaa',
        service_name: 'Service One',
        service_no: 1,
        stops: busServices['1']!.stops,
        shape: [
          { lat: 16.799, lng: 96.099 },
          { lat: 16.81, lng: 96.115 },
          { lat: 16.822, lng: 96.135 },
          { lat: 16.84, lng: 96.155 },
          { lat: 16.852, lng: 96.181 },
        ],
      },
    };

    const features = buildRouteFeatures(routePath, startStop, endStop, shapedServices);
    const busFeature = features.features.find((feature) => feature.properties.walk === false);

    expect(busFeature?.geometry.coordinates).toEqual([
      [96.099, 16.799],
      [96.115, 16.81],
      [96.135, 16.822],
      [96.155, 16.84],
      [96.181, 16.852],
    ]);
  });

  it('falls back to the service stop sequence when no shape geometry exists', () => {
    const routePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 0,
      path: [
        { bus_stop_id: 1, service_name: 1, lat: startStop.lat, lng: startStop.lng, color: '#44ccaa' },
        { bus_stop_id: 3, service_name: 1, lat: endStop.lat, lng: endStop.lng, color: '#44ccaa' },
      ],
    };

    const features = buildRouteFeatures(routePath, startStop, endStop, busServices);
    const busFeature = features.features.find((feature) => feature.properties.walk === false);

    expect(busFeature?.geometry.coordinates).toEqual([
      [96.1, 16.8],
      [96.14, 16.82],
      [96.18, 16.85],
    ]);
  });

  it('adds dashed walking links when the planned route starts and ends at nearby stops', () => {
    const routePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 0,
      path: [
        { bus_stop_id: 2, service_name: 1, lat: midStop.lat, lng: midStop.lng, color: '#44ccaa' },
      ],
    };

    const features = buildRouteFeatures(routePath, startStop, endStop, busServices);
    const walkingFeatures = features.features.filter((feature) => feature.properties.walk);

    expect(walkingFeatures).toHaveLength(2);
    expect(walkingFeatures[0]?.geometry.coordinates).toEqual([
      [96.1, 16.8],
      [96.14, 16.82],
    ]);
    expect(walkingFeatures[1]?.geometry.coordinates).toEqual([
      [96.14, 16.82],
      [96.18, 16.85],
    ]);
  });
});
