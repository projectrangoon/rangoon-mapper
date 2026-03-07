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

const midStopTwo: BusStop = {
  ...startStop,
  bus_stop_id: 4,
  lat: 16.821,
  lng: 96.141,
  name_en: 'Mid Two',
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
  it('uses the service shape geometry and anchors it through the matched route stops', () => {
    const routePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 0,
      path: [
        { bus_stop_id: 1, service_name: 1, lat: startStop.lat, lng: startStop.lng, color: '#44ccaa' },
        { bus_stop_id: 2, service_name: 1, lat: midStop.lat, lng: midStop.lng, color: '#44ccaa' },
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
      [96.1, 16.8],
      [96.115, 16.81],
      [96.14, 16.82],
      [96.155, 16.84],
      [96.18, 16.85],
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

  it('preserves consecutive stops even when they match the same shape vertex', () => {
    const routePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 0,
      path: [
        { bus_stop_id: 1, service_name: 1, lat: startStop.lat, lng: startStop.lng, color: '#44ccaa' },
        { bus_stop_id: 2, service_name: 1, lat: midStop.lat, lng: midStop.lng, color: '#44ccaa' },
        { bus_stop_id: 4, service_name: 1, lat: midStopTwo.lat, lng: midStopTwo.lng, color: '#44ccaa' },
        { bus_stop_id: 3, service_name: 1, lat: endStop.lat, lng: endStop.lng, color: '#44ccaa' },
      ],
    };

    const shapedServices: BusServicesMap = {
      '1': {
        color: '#44ccaa',
        service_name: 'Service One',
        service_no: 1,
        stops: [
          busServices['1']!.stops[0]!,
          busServices['1']!.stops[1]!,
          {
            ...midStopTwo,
            service_name: 1,
            color: '#44ccaa',
            sequence: 3,
            distance: 0.1,
          },
          busServices['1']!.stops[2]!,
        ],
        shape: [
          { lat: 16.8, lng: 96.1 },
          { lat: 16.8205, lng: 96.1405 },
          { lat: 16.85, lng: 96.18 },
        ],
      },
    };

    const features = buildRouteFeatures(routePath, startStop, endStop, shapedServices);
    const busFeature = features.features.find((feature) => feature.properties.walk === false);

    expect(busFeature?.geometry.coordinates).toEqual([
      [96.1, 16.8],
      [96.14, 16.82],
      [96.141, 16.821],
      [96.18, 16.85],
    ]);
  });

  it('uses the reversed shape direction when it better matches the stop order', () => {
    const routePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 0,
      path: [
        { bus_stop_id: 1, service_name: 1, lat: startStop.lat, lng: startStop.lng, color: '#44ccaa' },
        { bus_stop_id: 2, service_name: 1, lat: midStop.lat, lng: midStop.lng, color: '#44ccaa' },
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
          { lat: 16.852, lng: 96.181 },
          { lat: 16.84, lng: 96.155 },
          { lat: 16.822, lng: 96.135 },
          { lat: 16.81, lng: 96.115 },
          { lat: 16.799, lng: 96.099 },
        ],
      },
    };

    const features = buildRouteFeatures(routePath, startStop, endStop, shapedServices);
    const busFeature = features.features.find((feature) => feature.properties.walk === false);

    expect(busFeature?.geometry.coordinates).toEqual([
      [96.1, 16.8],
      [96.115, 16.81],
      [96.14, 16.82],
      [96.155, 16.84],
      [96.18, 16.85],
    ]);
  });

  it('wraps circular shapes so loop services stay on the correct road pass', () => {
    const loopMidStop: BusStop = {
      ...midStop,
      bus_stop_id: 5,
      lat: 16.83,
      lng: 96.15,
      name_en: 'Loop Mid',
      services: [{ service_name: 1, color: '#44ccaa', sequence: 1 }],
    };

    const loopEndStop: BusStop = {
      ...endStop,
      bus_stop_id: 6,
      lat: 16.85,
      lng: 96.18,
      name_en: 'Loop End',
      services: [{ service_name: 1, color: '#44ccaa', sequence: 2 }],
    };

    const loopStartStop: BusStop = {
      ...startStop,
      bus_stop_id: 7,
      lat: 16.8,
      lng: 96.1,
      name_en: 'Loop Start',
      services: [{ service_name: 1, color: '#44ccaa', sequence: 3 }],
    };

    const routePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 0,
      path: [
        { bus_stop_id: 7, service_name: 1, lat: loopStartStop.lat, lng: loopStartStop.lng, color: '#44ccaa' },
        { bus_stop_id: 5, service_name: 1, lat: loopMidStop.lat, lng: loopMidStop.lng, color: '#44ccaa' },
        { bus_stop_id: 6, service_name: 1, lat: loopEndStop.lat, lng: loopEndStop.lng, color: '#44ccaa' },
      ],
    };

    const shapedServices: BusServicesMap = {
      '1': {
        color: '#44ccaa',
        service_name: 'Service One',
        service_no: 1,
        stops: [
          {
            ...loopMidStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 1,
            distance: 0.1,
          },
          {
            ...loopEndStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 2,
            distance: 0.1,
          },
          {
            ...loopStartStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 3,
            distance: 0.1,
          },
          {
            ...loopMidStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 4,
            distance: 0.1,
          },
        ],
        shape: [
          { lat: loopMidStop.lat, lng: loopMidStop.lng },
          { lat: 16.84, lng: 96.165 },
          { lat: loopEndStop.lat, lng: loopEndStop.lng },
          { lat: 16.82, lng: 96.13 },
          { lat: loopStartStop.lat, lng: loopStartStop.lng },
        ],
      },
    };

    const features = buildRouteFeatures(routePath, loopStartStop, loopEndStop, shapedServices);
    const busFeature = features.features.find((feature) => feature.properties.walk === false);

    expect(busFeature?.geometry.coordinates).toEqual([
      [96.1, 16.8],
      [96.15, 16.83],
      [96.165, 16.84],
      [96.18, 16.85],
    ]);
  });

  it('rejects implausibly long shape slices when an end stop appears near multiple shape points', () => {
    const routePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 0,
      path: [
        { bus_stop_id: 1, service_name: 1, lat: startStop.lat, lng: startStop.lng, color: '#44ccaa' },
        { bus_stop_id: 2, service_name: 1, lat: midStop.lat, lng: midStop.lng, color: '#44ccaa' },
        { bus_stop_id: 4, service_name: 1, lat: midStopTwo.lat, lng: midStopTwo.lng, color: '#44ccaa' },
        { bus_stop_id: 3, service_name: 1, lat: endStop.lat, lng: endStop.lng, color: '#44ccaa' },
      ],
    };

    const shapedServices: BusServicesMap = {
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
            ...midStopTwo,
            service_name: 1,
            color: '#44ccaa',
            sequence: 3,
            distance: 0.1,
          },
          {
            ...endStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 4,
            distance: 0.1,
          },
        ],
        shape: [
          { lat: 16.8, lng: 96.1 },
          { lat: 16.81, lng: 96.11 },
          { lat: 16.82, lng: 96.14 },
          { lat: 16.821, lng: 96.141 },
          { lat: 16.85, lng: 96.18 },
          { lat: 16.9, lng: 96.24 },
          { lat: 16.94, lng: 96.28 },
          { lat: 16.96, lng: 96.31 },
          { lat: 16.85005, lng: 96.18005 },
        ],
      },
    };

    const features = buildRouteFeatures(routePath, startStop, endStop, shapedServices);
    const busFeature = features.features.find((feature) => feature.properties.walk === false);

    expect(busFeature?.geometry.coordinates).toEqual([
      [96.1, 16.8],
      [96.11, 16.81],
      [96.14, 16.82],
      [96.141, 16.821],
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
