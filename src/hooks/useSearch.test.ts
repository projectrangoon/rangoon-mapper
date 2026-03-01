import { act, renderHook } from '@testing-library/react';

import { useSearch } from '@/hooks/useSearch';
import type { UniqueStop } from '@/types';

const stops: UniqueStop[] = [
  {
    bus_stop_id: 1,
    lat: 16.8,
    lng: 96.1,
    name_en: 'Kone Zay Tan',
    name_mm: 'ကုန်းဈေးတန်း',
    road_en: 'Road 1',
    road_mm: 'လမ်း ၁',
    township_en: 'Town',
    township_mm: 'မြို့နယ်',
    services: [],
  },
  {
    bus_stop_id: 2,
    lat: 16.9,
    lng: 96.2,
    name_en: 'Nat Sin',
    name_mm: 'နတ်စင်',
    road_en: 'Road 2',
    road_mm: 'လမ်း ၂',
    township_en: 'Town',
    township_mm: 'မြို့နယ်',
    services: [],
  },
];

describe('useSearch', () => {
  it('debounces and returns matching results', async () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ query }) => useSearch(stops, query, 100), {
      initialProps: { query: '' },
    });

    expect(result.current.results).toHaveLength(0);

    rerender({ query: 'kone' });
    expect(result.current.isSearching).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.isSearching).toBe(false);
    expect(result.current.results.map((stop) => stop.bus_stop_id)).toEqual([1]);

    vi.useRealTimers();
  });
});
