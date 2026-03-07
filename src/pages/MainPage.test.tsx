import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import MainPage from '@/pages/MainPage';
import { useAppStore } from '@/stores/useAppStore';
import { useBusStore } from '@/stores/useBusStore';
import { useMapStore } from '@/stores/useMapStore';
import type { AdjacencyList, BusServicesMap, BusStop, BusStopsMap, UniqueStop } from '@/types';

vi.mock('@/components/map/MapView', () => ({
  default: () => <div>MapView Mock</div>,
}));

const stop1: BusStop = {
  bus_stop_id: 1,
  lat: 16.8,
  lng: 96.1,
  name_en: 'Start Stop',
  name_mm: 'အစ',
  road_en: 'Road 1',
  road_mm: 'လမ်း ၁',
  township_en: 'Township',
  township_mm: 'မြို့နယ်',
  services: [{ service_name: 1, color: '#3a8', sequence: 1 }],
};

const stop2: BusStop = {
  ...stop1,
  bus_stop_id: 2,
  lat: 16.95,
  lng: 96.25,
  name_en: 'End Stop',
  name_mm: 'အဆုံး',
  services: [{ service_name: 1, color: '#3a8', sequence: 2 }],
};

const busStopsMap: BusStopsMap = { 1: stop1, 2: stop2 };
const uniqueStops: UniqueStop[] = [stop1, stop2];
const busServices: BusServicesMap = {
  '1': {
    color: '#3a8',
    service_name: 'Service One',
    service_no: 1,
    stops: [
      {
        ...stop1,
        service_name: 1,
        color: '#3a8',
        sequence: 1,
        distance: 0.5,
      },
      {
        ...stop2,
        service_name: 1,
        color: '#3a8',
        sequence: 2,
        distance: 0.5,
      },
    ],
  },
};
const graph: AdjacencyList = {
  '1': [
    {
      ...stop2,
      service_name: 1,
      color: '#3a8',
      sequence: 2,
      distance: 0.5,
    },
  ],
  '2': [],
};

const renderWithRoute = (route: string) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/directions/:startStop/:endStop" element={<MainPage />} />
        <Route path="/bus" element={<MainPage />} />
        <Route path="/bus/:serviceName" element={<MainPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('MainPage routing behavior', () => {
  beforeEach(() => {
    useMapStore.setState({
      center: { lat: 16.7943528, lng: 96.1518985 },
      zoom: 13,
      graph,
      busStopsMap,
      busServices,
      uniqueStops,
      startStop: null,
      endStop: null,
      routePath: null,
      isCalculating: false,
      isDataReady: true,
    });

    useBusStore.setState({ selectedServices: new Set<string>(), expandedService: null });
    useAppStore.setState({
      mode: 'route',
      panelOpen: true,
      searchQuery: '',
      isSearchFocused: false,
    });
  });

  it('loads directions deep link into route mode', async () => {
    useBusStore.setState({ selectedServices: new Set<string>(['1']), expandedService: '1' });

    renderWithRoute('/directions/1/2');

    expect(screen.getByText('Routing To')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByDisplayValue('Start Stop')).toBeInTheDocument();
      expect(screen.getByDisplayValue('End Stop')).toBeInTheDocument();
      expect(useBusStore.getState().selectedServices.size).toBe(0);
      expect(useBusStore.getState().expandedService).toBeNull();
    });
  });

  it('loads bus deep link into lines mode', async () => {
    renderWithRoute('/bus/1');

    await waitFor(() => {
      expect(screen.getByText('Bus Lines')).toBeInTheDocument();
      expect(screen.getByText('Service One')).toBeInTheDocument();
    });
  });

  it('clears selected lines when switching back to route mode', async () => {
    renderWithRoute('/bus/1');

    await waitFor(() => {
      expect(useBusStore.getState().selectedServices.has('1')).toBe(true);
      expect(screen.getByText('Bus Lines')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Route' }));

    await waitFor(() => {
      expect(screen.getByText('Routing To')).toBeInTheDocument();
      expect(useBusStore.getState().selectedServices.size).toBe(0);
      expect(useBusStore.getState().expandedService).toBeNull();
    });
  });

  it('reverses the selected start and end stops from the route panel control', async () => {
    renderWithRoute('/directions/1/2');

    await waitFor(() => {
      expect(screen.getByDisplayValue('Start Stop')).toBeInTheDocument();
      expect(screen.getByDisplayValue('End Stop')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reverse route' }));

    await waitFor(() => {
      expect(screen.getByDisplayValue('End Stop')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Start Stop')).toBeInTheDocument();
      expect(useMapStore.getState().startStop?.bus_stop_id).toBe(2);
      expect(useMapStore.getState().endStop?.bus_stop_id).toBe(1);
    });
  });

  it('clears the selected waypoint when the route field x button is clicked', async () => {
    const user = userEvent.setup();

    renderWithRoute('/directions/1/2');

    await waitFor(() => {
      expect(screen.getByDisplayValue('Start Stop')).toBeInTheDocument();
      expect(screen.getByDisplayValue('End Stop')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Clear From' }));

    await waitFor(() => {
      expect(useMapStore.getState().startStop).toBeNull();
      expect(useMapStore.getState().endStop?.bus_stop_id).toBe(2);
      expect(useMapStore.getState().routePath).toBeNull();
      expect(screen.getAllByPlaceholderText('Search bus stop')[0]).toHaveValue('');
    });
  });
});
