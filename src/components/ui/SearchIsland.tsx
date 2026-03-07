import { Command, Search } from 'lucide-react';
import { forwardRef, useMemo, useState } from 'react';

import type { UniqueStop } from '@/types';

interface SearchIslandProps {
  query: string;
  results: UniqueStop[];
  onQueryChange: (value: string) => void;
  onSelect: (stop: UniqueStop) => void;
}

const SearchIsland = forwardRef<HTMLInputElement, SearchIslandProps>(function SearchIsland(
  { query, results, onQueryChange, onSelect },
  ref,
) {
  const [open, setOpen] = useState(false);

  const shownResults = useMemo(() => results.slice(0, 8), [results]);

  return (
    <div className="search-island" onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 120)}>
      <div className="search-icon-shell">
        <Search size={16} className="search-icon" />
      </div>
      <input
        ref={ref}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search stops, roads, townships"
        aria-label="Search Stops"
      />
      <div className="search-kbd">
        <Command size={12} />K
      </div>

      {open && query.trim().length > 0 && (
        <ul className="search-results">
          {shownResults.length === 0 && <li className="empty">No matching stops</li>}
          {shownResults.map((stop) => (
            <li key={stop.bus_stop_id}>
              <button type="button" onClick={() => onSelect(stop)}>
                <strong>{stop.name_en}</strong>
                <small>
                  {stop.name_mm} · {stop.road_en}
                </small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default SearchIsland;
