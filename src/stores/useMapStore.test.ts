import { useMapStore } from '@/stores/useMapStore';
import type { AdjacencyList, BusServicesMap, BusStop, BusStopsMap, UniqueStop } from '@/types';

const makeStop = (id: number, latOffset: number, lngOffset: number): BusStop => ({
  bus_stop_id: id,
  lat: 16.8 + latOffset,
  lng: 96.1 + lngOffset,
  name_en: `Stop ${id}`,
  name_mm: `မှတ်တိုင် ${id}`,
  road_en: 'Road',
  road_mm: 'လမ်း',
  township_en: 'Township',
  township_mm: 'မြို့နယ်',
  services: [{ service_name: 1, color: '#000', sequence: id }],
});

describe('useMapStore', () => {
  const stop1 = makeStop(1, 0.001, 0.001);
  const stop2 = makeStop(2, 0.06, 0.06);

  const graph: AdjacencyList = {
    '1': [
      {
        ...stop2,
        service_name: 1,
        color: '#000',
        sequence: 2,
        distance: 0.4,
      },
    ],
    '2': [],
  };

  const busStopsMap: BusStopsMap = { 1: stop1, 2: stop2 };
  const busServices: BusServicesMap = {
    '1': { color: '#000', service_name: 'A', service_no: 1, stops: [] },
  };
  const uniqueStops: UniqueStop[] = [stop1, stop2];

  beforeEach(() => {
    useMapStore.setState({
      center: { lat: 16.7943528, lng: 96.1518985 },
      zoom: 13,
      graph: null,
      busStopsMap: null,
      busServices: null,
      uniqueStops: [],
      startStop: null,
      endStop: null,
      routePath: null,
      isCalculating: false,
      isDataReady: false,
    });
  });

  it('loads data and resolves route', async () => {
    useMapStore.getState().loadData({ graph, busStopsMap, busServices, uniqueStops });
    useMapStore.getState().setStartStop(stop1);
    useMapStore.getState().setEndStop(stop2);

    const route = await useMapStore.getState().calculateCurrentRoute();

    expect(useMapStore.getState().isDataReady).toBe(true);
    expect(route?.path.map((step) => step.bus_stop_id)).toEqual([1, 2]);
    expect(useMapStore.getState().routePath?.path).toHaveLength(2);
  });
});
