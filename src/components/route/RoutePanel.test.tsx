import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RoutePanel from '@/components/route/RoutePanel';
import type { BusStop, RoutePath, UniqueStop } from '@/types';

const startStop: BusStop = {
  bus_stop_id: 1,
  lat: 16.8,
  lng: 96.1,
  name_en: 'Sule Square',
  name_mm: 'ဆူးလေ',
  road_en: 'Maha Bandula Road',
  road_mm: 'မဟာဗန္ဓုလလမ်း',
  township_en: 'Kyauktada',
  township_mm: 'ကျောက်တံတား',
  services: [{ service_name: 1, color: '#fff', sequence: 1 }],
};

const endStop: BusStop = {
  ...startStop,
  bus_stop_id: 2,
  name_en: 'Hledan Center',
  road_en: 'Pyay Road',
  township_en: 'Kamayut',
  services: [{ service_name: 1, color: '#fff', sequence: 2 }],
};

const routePath: RoutePath = {
  currCost: 1,
  currDistance: 12.4,
  currTransfers: 1,
  path: [
    { bus_stop_id: 1, service_name: 1, lat: startStop.lat, lng: startStop.lng, color: '#fff' },
    { bus_stop_id: 2, service_name: 1, lat: endStop.lat, lng: endStop.lng, color: '#fff' },
  ],
};

describe('RoutePanel', () => {
  it('shows a compact waypoint editor without duplicating the planned route summary', () => {
    render(
      <RoutePanel
        locale="en"
        uniqueStops={[startStop as UniqueStop, endStop as UniqueStop]}
        startStop={startStop}
        endStop={endStop}
        routePath={routePath}
        isCalculating={false}
        onSelectStart={() => undefined}
        onSelectEnd={() => undefined}
        onSwapStops={() => undefined}
      />,
    );

    expect(screen.queryByLabelText('Planned Route Waypoints')).not.toBeInTheDocument();
    expect(screen.getByText('Waypoints')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sule Square')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hledan Center')).toBeInTheDocument();
  });

  it('calls the reverse handler from the planned route swap control', async () => {
    const user = userEvent.setup();
    const onSwapStops = vi.fn();

    render(
      <RoutePanel
        locale="en"
        uniqueStops={[startStop as UniqueStop, endStop as UniqueStop]}
        startStop={startStop}
        endStop={endStop}
        routePath={routePath}
        isCalculating={false}
        onSelectStart={() => undefined}
        onSelectEnd={() => undefined}
        onSwapStops={onSwapStops}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Reverse route' }));

    expect(onSwapStops).toHaveBeenCalledTimes(1);
  });

  it('renders localized stop names and labels in Burmese mode', () => {
    render(
      <RoutePanel
        locale="my"
        uniqueStops={[startStop as UniqueStop, endStop as UniqueStop]}
        startStop={startStop}
        endStop={endStop}
        routePath={routePath}
        isCalculating={false}
        onSelectStart={() => undefined}
        onSelectEnd={() => undefined}
        onSwapStops={() => undefined}
      />,
    );

    expect(screen.getByText('မှတ်တိုင်များ')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('ဆူးလေ')).toHaveLength(2);
  });
});
