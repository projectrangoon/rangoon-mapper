import { calculateRoute } from '@/lib/routeCalculator';
import type { AdjacencyList, BusStop, BusStopsMap } from '@/types';

const makeStop = (bus_stop_id: number, services: Array<{ service_name: number; color: string; sequence: number }>): BusStop => ({
  bus_stop_id,
  lat: 16.8 + bus_stop_id * 0.0001,
  lng: 96.1 + bus_stop_id * 0.0001,
  name_en: `Stop ${bus_stop_id}`,
  name_mm: `မှတ်တိုင် ${bus_stop_id}`,
  road_en: 'Road',
  road_mm: 'လမ်း',
  township_en: 'Township',
  township_mm: 'မြို့နယ်',
  services,
});

describe('calculateRoute', () => {
  const busStopsMap: BusStopsMap = {
    1: makeStop(1, [{ service_name: 7, color: '#ff0000', sequence: 1 }]),
    2: makeStop(2, [{ service_name: 7, color: '#ff0000', sequence: 2 }]),
    3: makeStop(3, [{ service_name: 7, color: '#ff0000', sequence: 3 }]),
  };
  const stop1 = busStopsMap[1]!;
  const stop2 = busStopsMap[2]!;
  const stop3 = busStopsMap[3]!;

  const graph: AdjacencyList = {
    '1': [
      {
        bus_stop_id: stop2.bus_stop_id,
        lat: stop2.lat,
        lng: stop2.lng,
        name_en: stop2.name_en,
        name_mm: stop2.name_mm,
        road_en: stop2.road_en,
        road_mm: stop2.road_mm,
        township_en: stop2.township_en,
        township_mm: stop2.township_mm,
        service_name: 7,
        color: '#ff0000',
        sequence: 2,
        distance: 0.6,
      },
    ],
    '2': [
      {
        bus_stop_id: stop3.bus_stop_id,
        lat: stop3.lat,
        lng: stop3.lng,
        name_en: stop3.name_en,
        name_mm: stop3.name_mm,
        road_en: stop3.road_en,
        road_mm: stop3.road_mm,
        township_en: stop3.township_en,
        township_mm: stop3.township_mm,
        service_name: 7,
        color: '#ff0000',
        sequence: 3,
        distance: 0.8,
      },
    ],
    '3': [],
  };

  it('returns the shortest path and resolves stop objects', () => {
    const route = calculateRoute(graph, busStopsMap, stop1, stop3, {
      walkingDistance: 0,
    });

    expect(route).not.toBeNull();
    expect(route?.path.map((step) => step.bus_stop_id)).toEqual([1, 2, 3]);
    expect(route?.path[0]?.service_name).toBe(7);
    expect(route?.currTransfers).toBe(0);
    expect(route?.currDistance).toBeCloseTo(1.4, 5);
  });

  it('returns null when no route exists', () => {
    const disconnected: AdjacencyList = { '1': [], '2': [], '3': [] };
    const route = calculateRoute(disconnected, busStopsMap, stop1, stop3, {
      walkingDistance: 0,
    });

    expect(route).toBeNull();
  });

  it('does not stop early to walk when the destination remains on the current bus service', () => {
    const routedBusStopsMap: BusStopsMap = {
      1: makeStop(1, [{ service_name: 7, color: '#ff0000', sequence: 1 }]),
      2: {
        ...makeStop(2, [{ service_name: 7, color: '#ff0000', sequence: 2 }]),
        lat: 16.801,
        lng: 96.101,
      },
      3: {
        ...makeStop(3, [{ service_name: 7, color: '#ff0000', sequence: 3 }]),
        lat: 16.804,
        lng: 96.104,
      },
      4: {
        ...makeStop(4, [{ service_name: 7, color: '#ff0000', sequence: 4 }]),
        lat: 16.8044,
        lng: 96.1044,
      },
    };

    const routedGraph: AdjacencyList = {
      '1': [
        {
          ...routedBusStopsMap[2]!,
          service_name: 7,
          color: '#ff0000',
          sequence: 2,
          distance: 0.2,
        },
      ],
      '2': [
        {
          ...routedBusStopsMap[3]!,
          service_name: 7,
          color: '#ff0000',
          sequence: 3,
          distance: 0.2,
        },
      ],
      '3': [
        {
          ...routedBusStopsMap[4]!,
          service_name: 7,
          color: '#ff0000',
          sequence: 4,
          distance: 0.05,
        },
      ],
      '4': [],
    };

    const route = calculateRoute(
      routedGraph,
      routedBusStopsMap,
      routedBusStopsMap[1]!,
      routedBusStopsMap[4]!,
      { walkingDistance: 0.75 },
    );

    expect(route?.path.map((step) => step.bus_stop_id)).toEqual([1, 2, 3, 4]);
    expect(route?.path.at(-1)?.walk).toBeUndefined();
  });

  it('can still choose to walk early when that beats staying on the same bus service', () => {
    const routedBusStopsMap: BusStopsMap = {
      1: makeStop(1, [{ service_name: 7, color: '#ff0000', sequence: 1 }]),
      2: {
        ...makeStop(2, [{ service_name: 7, color: '#ff0000', sequence: 2 }]),
        lat: 16.801,
        lng: 96.101,
      },
      3: {
        ...makeStop(3, [{ service_name: 7, color: '#ff0000', sequence: 3 }]),
        lat: 16.804,
        lng: 96.104,
      },
      4: {
        ...makeStop(4, [{ service_name: 7, color: '#ff0000', sequence: 4 }]),
        lat: 16.8044,
        lng: 96.1044,
      },
    };

    const routedGraph: AdjacencyList = {
      '1': [
        {
          ...routedBusStopsMap[2]!,
          service_name: 7,
          color: '#ff0000',
          sequence: 2,
          distance: 0.2,
        },
      ],
      '2': [
        {
          ...routedBusStopsMap[3]!,
          service_name: 7,
          color: '#ff0000',
          sequence: 3,
          distance: 0.2,
        },
      ],
      '3': [
        {
          ...routedBusStopsMap[4]!,
          service_name: 7,
          color: '#ff0000',
          sequence: 4,
          distance: 40,
        },
      ],
      '4': [],
    };

    const route = calculateRoute(
      routedGraph,
      routedBusStopsMap,
      routedBusStopsMap[1]!,
      routedBusStopsMap[4]!,
      { walkingDistance: 0.75 },
    );

    expect(route?.path.map((step) => step.bus_stop_id)).toEqual([1, 2, 3]);
    expect(route?.path.at(-1)?.walk).toBe(true);
  });
});
