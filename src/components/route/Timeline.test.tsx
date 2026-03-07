import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Timeline, { buildTimeline } from '@/components/route/Timeline';
import type { BusStop, RoutePath } from '@/types';

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
  services: [{ service_name: 18, color: '#d65252', sequence: 1 }],
};

const endStop: BusStop = {
  ...startStop,
  bus_stop_id: 6,
  lat: 16.86,
  lng: 96.16,
  name_en: 'End',
  services: [{ service_name: 59, color: '#334f9b', sequence: 1 }],
};

const routePath: RoutePath = {
  currCost: 1,
  currDistance: 7.33,
  currTransfers: 1,
  path: [
    { bus_stop_id: 1, service_name: 18, lat: 16.8, lng: 96.1, name_en: 'Lan Sone', color: '#d65252' },
    { bus_stop_id: 2, service_name: 18, lat: 16.81, lng: 96.11, name_en: 'Stop A', color: '#d65252' },
    { bus_stop_id: 3, service_name: 18, lat: 16.82, lng: 96.12, name_en: 'Zay Lay', color: '#d65252' },
    { bus_stop_id: 3, service_name: 59, lat: 16.82, lng: 96.12, name_en: 'Zay Lay', color: '#334f9b' },
    { bus_stop_id: 4, service_name: 59, lat: 16.83, lng: 96.13, name_en: 'Stop B', color: '#334f9b' },
    { bus_stop_id: 5, service_name: 59, lat: 16.84, lng: 96.14, name_en: 'Stop C', color: '#334f9b' },
    { bus_stop_id: 6, service_name: 59, lat: 16.85, lng: 96.15, name_en: 'Shwe Gon Daing', color: '#334f9b' },
  ],
};

describe('buildTimeline', () => {
  it('includes intermediate stops for each transit leg', () => {
    const segments = buildTimeline(routePath, startStop, endStop);

    expect(segments[0]).toMatchObject({
      kind: 'bus',
      title: 'Take YBS 18',
      subtitle: 'Lan Sone → Zay Lay',
      stops: ['Stop A'],
    });
    expect(segments[1]).toMatchObject({
      kind: 'bus',
      title: 'Take YBS 59',
      subtitle: 'Zay Lay → Shwe Gon Daing',
      stops: ['Stop B', 'Stop C'],
    });
  });

  it('formats walk distances in imperial units', () => {
    const walkingRoutePath: RoutePath = {
      currCost: 1,
      currDistance: 1,
      currTransfers: 0,
      path: [
        { bus_stop_id: 2, service_name: 18, lat: 16.81, lng: 96.11, name_en: 'Board Stop', color: '#d65252', distance: 0.046 },
        { bus_stop_id: 3, service_name: 18, lat: 16.82, lng: 96.12, name_en: 'Ride', color: '#d65252' },
        { bus_stop_id: 4, service_name: 18, lat: 16.83, lng: 96.13, name_en: 'Alight', color: '#d65252', distance: 0.385 },
      ],
    };

    const walkingStartStop: BusStop = {
      ...startStop,
      bus_stop_id: 99,
      name_en: 'Walk Start',
    };

    const walkingEndStop: BusStop = {
      ...endStop,
      bus_stop_id: 100,
      name_en: 'Walk End',
    };

    const segments = buildTimeline(walkingRoutePath, walkingStartStop, walkingEndStop);

    expect(segments[0]).toMatchObject({ kind: 'walk', subtitle: '151 ft' });
    expect(segments[2]).toMatchObject({ kind: 'walk', subtitle: '0.24 mi' });
  });
});

describe('Timeline', () => {
  it('renders the intermediate transit stops in a collapsible transit leg', async () => {
    const user = userEvent.setup();

    render(<Timeline routePath={routePath} startStop={startStop} endStop={endStop} />);

    const expandedLegs = document.querySelectorAll('.timeline-leg-details-connect-next');
    expect(expandedLegs).toHaveLength(1);

    expect(screen.getByLabelText('Take YBS 18 stops')).toBeInTheDocument();
    expect(screen.getByText('Stop A')).toBeInTheDocument();
    expect(screen.getByText('Stop B')).toBeInTheDocument();
    expect(screen.getByText('Stop C')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /1 stop/i }));

    expect(screen.queryByText('Stop A')).not.toBeInTheDocument();
  });
});
