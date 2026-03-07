import uniqueStopsJson from '../../public/data/unique_stops.json';

import { isEnglish, searchBusStops } from '@/lib/search';
import type { UniqueStop } from '@/types';

const uniqueStops = uniqueStopsJson as UniqueStop[];

describe('search utilities', () => {
  it('detects english and non-english input', () => {
    expect(isEnglish('kone zay')).toBe(true);
    expect(isEnglish('ကွန်ဇေး')).toBe(false);
  });

  it('finds english names using start or word boundary matching', () => {
    const results = searchBusStops(uniqueStops, 'kone').map((stop) => stop.name_en);

    expect(results).toContain('Kone Zay Tan');
    expect(results).toContain('Kyauk Kone');
    expect(results).not.toContain('Lanmakonedaw');
  });

  it('finds myanmar names when searching with myanmar text', () => {
    const results = searchBusStops(uniqueStops, 'ဈေး');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((stop) => stop.name_mm.includes('ဈေး'))).toBe(true);
  });

  it('finds roads and townships in both locales', () => {
    expect(searchBusStops(uniqueStops, 'Lanmadaw').some((stop) => stop.township_en === 'Lanmadaw')).toBe(true);
    expect(searchBusStops(uniqueStops, 'လမ်းမတော်').some((stop) => stop.township_mm === 'လမ်းမတော်')).toBe(true);
  });
});
