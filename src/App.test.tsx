import { render, screen, waitFor } from '@testing-library/react';

import App from '@/App';
import { useMapStore } from '@/stores/useMapStore';

vi.mock('@/components/map/MapView', () => ({
  default: () => <div>MapView Mock</div>,
}));

const fixtureStop = {
  bus_stop_id: 1,
  lat: 16.8,
  lng: 96.1,
  name_en: 'Stop 1',
  name_mm: 'မှတ်တိုင် ၁',
  road_en: 'Road',
  road_mm: 'လမ်း',
  township_en: 'Township',
  township_mm: 'မြို့နယ်',
  services: [{ service_name: 1, color: '#000', sequence: 1 }],
};

const responses = {
  '/data/adjancencyList.json': { '1': [] },
  '/data/stops_map.json': { '1': fixtureStop },
  '/data/bus_services.json': { '1': { color: '#000', service_name: 'A', service_no: 1, stops: [fixtureStop] } },
  '/data/unique_stops.json': [fixtureStop],
  '/data/route_shapes.json': { '1': [{ lat: fixtureStop.lat, lng: fixtureStop.lng }] },
};

describe('App bootstrap', () => {
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

  it('renders loading then app shell after data load', async () => {
    vi.spyOn(window, 'fetch').mockImplementation(async (input) => {
      const key = typeof input === 'string' ? input : input.toString();
      const body = responses[key as keyof typeof responses];
      return {
        ok: true,
        status: 200,
        json: async () => body,
      } as Response;
    });

    render(<App />);

    expect(screen.getByRole('heading', { name: 'Rangoon Mapper' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('MapView Mock')).toBeInTheDocument();
    });
  });
});
