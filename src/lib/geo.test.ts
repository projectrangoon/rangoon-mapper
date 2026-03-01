import stopsMapJson from '../../public/data/stops_map.json';
import uniqueStopsJson from '../../public/data/unique_stops.json';

import { getDistance, getNearbyStops, groupBy } from '@/lib/geo';
import type { BusStop, BusStopsMap } from '@/types';

const stopsMap = stopsMapJson as BusStopsMap;
const uniqueStops = uniqueStopsJson as BusStop[];

describe('geo utilities', () => {
  it('calculates haversine distance in km', () => {
    const distance = getDistance(16.868886, 96.222571, 16.871166, 96.225125);
    expect(distance).toBeGreaterThan(0.3);
    expect(distance).toBeLessThan(0.5);
  });

  it('returns nearby stops around a source stop', () => {
    const sourceStop = {
      bus_stop_id: 118,
      name_en: 'Kili',
      lat: 16.774989,
      lng: 96.139475,
    };

    const nearbyStops = getNearbyStops(stopsMap, sourceStop, 0.5);
    const matchedIds = new Set(nearbyStops.map((stop) => stop.bus_stop_id));

    expect(matchedIds.has(119)).toBe(true);
    expect(matchedIds.has(124)).toBe(true);

    const expandedReference = uniqueStops
      .filter((stop) => stop.bus_stop_id === 119 || stop.bus_stop_id === 124)
      .flatMap((stop) => stop.services.map((service) => `${stop.bus_stop_id}:${service.service_name}`));

    const expandedNearby = nearbyStops.map((stop) => `${stop.bus_stop_id}:${stop.service_name}`);
    expect(expandedNearby.sort()).toEqual(expandedReference.sort());
  });

  it('groups items in insertion order', () => {
    const grouped = groupBy(
      [
        { name: 'a', service: 1 },
        { name: 'b', service: 1 },
        { name: 'c', service: 2 },
      ],
      'service',
    );

    expect(grouped).toEqual([
      [
        { name: 'a', service: 1 },
        { name: 'b', service: 1 },
      ],
      [{ name: 'c', service: 2 }],
    ]);
  });
});
