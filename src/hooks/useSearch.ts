import { useEffect, useMemo, useState } from 'react';

import { searchBusStops } from '@/lib/search';
import type { UniqueStop } from '@/types';

export const useSearch = (stops: UniqueStop[], query: string, debounceMs = 220) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [query, debounceMs]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }

    return searchBusStops(stops, debouncedQuery).slice(0, 20);
  }, [debouncedQuery, stops]);

  return {
    query: debouncedQuery,
    results,
    isSearching: query.trim() !== debouncedQuery.trim(),
  };
};
