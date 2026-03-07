import { render, screen } from '@testing-library/react';

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
  it('shows a dedicated start and destination summary once a route exists', () => {
    render(
      <RoutePanel
        uniqueStops={[startStop as UniqueStop, endStop as UniqueStop]}
        startStop={startStop}
        endStop={endStop}
        routePath={routePath}
        isCalculating={false}
        onSelectStart={() => undefined}
        onSelectEnd={() => undefined}
      />,
    );

    expect(screen.getByLabelText('Planned Route Waypoints')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Destination')).toBeInTheDocument();
    expect(screen.getByText('Sule Square')).toBeInTheDocument();
    expect(screen.getAllByText('Hledan Center')).toHaveLength(2);
  });
});
