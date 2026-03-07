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
          { lat: loopMidStop.lat, lng: loopMidStop.lng },
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

  it('prefers the plausible nearby branch when a later loop point is only slightly closer', () => {
    const loopBranchStop: BusStop = {
      ...startStop,
      bus_stop_id: 5,
      lat: 16.83,
      lng: 96.13,
      name_en: 'Loop Branch',
      services: [{ service_name: 1, color: '#44ccaa', sequence: 4 }],
    };

    const fartherEndStop: BusStop = {
      ...endStop,
      lat: 16.84,
      lng: 96.14,
    };

    const routePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 0,
      path: [
        { bus_stop_id: 1, service_name: 1, lat: startStop.lat, lng: startStop.lng, color: '#44ccaa' },
        { bus_stop_id: 2, service_name: 1, lat: 16.81, lng: 96.11, color: '#44ccaa' },
        { bus_stop_id: 4, service_name: 1, lat: 16.82, lng: 96.12, color: '#44ccaa' },
        { bus_stop_id: 5, service_name: 1, lat: loopBranchStop.lat, lng: loopBranchStop.lng, color: '#44ccaa' },
        { bus_stop_id: 3, service_name: 1, lat: fartherEndStop.lat, lng: fartherEndStop.lng, color: '#44ccaa' },
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
            lat: 16.81,
            lng: 96.11,
            service_name: 1,
            color: '#44ccaa',
            sequence: 2,
            distance: 0.1,
          },
          {
            ...midStopTwo,
            lat: 16.82,
            lng: 96.12,
            service_name: 1,
            color: '#44ccaa',
            sequence: 3,
            distance: 0.1,
          },
          {
            ...loopBranchStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 4,
            distance: 0.1,
          },
          {
            ...fartherEndStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 5,
            distance: 0.1,
          },
        ],
        shape: [
          { lat: 16.8, lng: 96.1 },
          { lat: 16.805, lng: 96.105 },
          { lat: 16.81, lng: 96.11 },
          { lat: 16.82, lng: 96.12 },
          { lat: 16.83, lng: 96.13 },
          { lat: 16.8398, lng: 96.1398 },
          { lat: 16.845, lng: 96.145 },
          { lat: 16.85, lng: 96.15 },
          { lat: 16.855, lng: 96.155 },
          { lat: 16.86, lng: 96.16 },
          { lat: 16.855, lng: 96.157 },
          { lat: 16.85, lng: 96.153 },
          { lat: 16.845, lng: 96.147 },
          { lat: 16.84001, lng: 96.14001 },
        ],
      },
    };

    const features = buildRouteFeatures(routePath, startStop, fartherEndStop, shapedServices);
    const busFeature = features.features.find((feature) => feature.properties.walk === false);

    expect(busFeature?.geometry.coordinates).toEqual([
      [96.1, 16.8],
      [96.105, 16.805],
      [96.11, 16.81],
      [96.12, 16.82],
      [96.13, 16.83],
      [96.14, 16.84],
    ]);
  });

  it('falls back to circular stop order when an open loop shape would create a fake seam jump', () => {
    const seamStartStop: BusStop = {
      ...startStop,
      bus_stop_id: 10,
      lat: 16.84,
      lng: 96.14,
      name_en: 'Seam Start',
      services: [{ service_name: 1, color: '#44ccaa', sequence: 8 }],
    };

    const seamMidStop: BusStop = {
      ...startStop,
      bus_stop_id: 11,
      lat: 16.82,
      lng: 96.12,
      name_en: 'Seam Mid',
      services: [{ service_name: 1, color: '#44ccaa', sequence: 10 }],
    };

    const terminalStop: BusStop = {
      ...startStop,
      bus_stop_id: 12,
      lat: 16.8,
      lng: 96.1,
      name_en: 'Terminal',
      services: [{ service_name: 1, color: '#44ccaa', sequence: 1 }],
    };

    const wrapRoutePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 0,
      path: [
        { bus_stop_id: 10, service_name: 1, lat: seamStartStop.lat, lng: seamStartStop.lng, color: '#44ccaa' },
        { bus_stop_id: 11, service_name: 1, lat: seamMidStop.lat, lng: seamMidStop.lng, color: '#44ccaa' },
        { bus_stop_id: 12, service_name: 1, lat: terminalStop.lat, lng: terminalStop.lng, color: '#44ccaa' },
        { bus_stop_id: 1, service_name: 1, lat: startStop.lat, lng: startStop.lng, color: '#44ccaa' },
        { bus_stop_id: 2, service_name: 1, lat: midStop.lat, lng: midStop.lng, color: '#44ccaa' },
      ],
    };

    const circularServices: BusServicesMap = {
      '1': {
        color: '#44ccaa',
        service_name: 'Service One',
        service_no: 1,
        stops: [
          {
            ...terminalStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 1,
            distance: 0.1,
          },
          {
            ...startStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 2,
            distance: 0.1,
          },
          {
            ...midStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 3,
            distance: 0.1,
          },
          {
            ...midStopTwo,
            service_name: 1,
            color: '#44ccaa',
            sequence: 4,
            distance: 0.1,
          },
          {
            ...endStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 5,
            distance: 0.1,
          },
          {
            ...seamStartStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 6,
            distance: 0.1,
          },
          {
            ...seamMidStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 7,
            distance: 0.1,
          },
          {
            ...terminalStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 8,
            distance: 0.1,
          },
        ],
        shape: [
          { lat: terminalStop.lat, lng: terminalStop.lng },
          { lat: startStop.lat, lng: startStop.lng },
          { lat: midStop.lat, lng: midStop.lng },
          { lat: midStopTwo.lat, lng: midStopTwo.lng },
          { lat: endStop.lat, lng: endStop.lng },
          { lat: seamStartStop.lat, lng: seamStartStop.lng },
          { lat: seamMidStop.lat, lng: seamMidStop.lng },
        ],
      },
    };

    const features = buildRouteFeatures(wrapRoutePath, seamStartStop, midStop, circularServices);
    const busFeature = features.features.find((feature) => feature.properties.walk === false);

    expect(busFeature?.geometry.coordinates).toEqual([
      [96.14, 16.84],
      [96.12, 16.82],
      [96.1, 16.8],
      [96.14, 16.82],
    ]);
  });

  it('rejects shape runs that contain an implausible jump between adjacent route stops', () => {
    const nearbyEndStop: BusStop = {
      ...endStop,
      lat: 16.823,
      lng: 96.143,
    };

    const routePath: RoutePath = {
      currCost: 1,
      currDistance: 2,
      currTransfers: 0,
      path: [
        { bus_stop_id: 1, service_name: 1, lat: startStop.lat, lng: startStop.lng, color: '#44ccaa' },
        { bus_stop_id: 2, service_name: 1, lat: midStop.lat, lng: midStop.lng, color: '#44ccaa' },
        { bus_stop_id: 3, service_name: 1, lat: nearbyEndStop.lat, lng: nearbyEndStop.lng, color: '#44ccaa' },
      ],
    };

    const brokenShapeServices: BusServicesMap = {
      '1': {
        color: '#44ccaa',
        service_name: 'Service One',
        service_no: 1,
        stops: [
          busServices['1']!.stops[0]!,
          busServices['1']!.stops[1]!,
          {
            ...nearbyEndStop,
            service_name: 1,
            color: '#44ccaa',
            sequence: 3,
            distance: 0.1,
          },
        ],
        shape: [
          { lat: startStop.lat, lng: startStop.lng },
          { lat: midStop.lat, lng: midStop.lng },
          { lat: 16.9, lng: 96.26 },
          { lat: nearbyEndStop.lat, lng: nearbyEndStop.lng },
        ],
      },
    };

    const features = buildRouteFeatures(routePath, startStop, nearbyEndStop, brokenShapeServices);
    const busFeature = features.features.find((feature) => feature.properties.walk === false);

    expect(busFeature?.geometry.coordinates).toEqual([
      [96.1, 16.8],
      [96.14, 16.82],
      [96.143, 16.823],
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
