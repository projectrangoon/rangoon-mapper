import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useSearch } from '@/hooks/useSearch';
import type { BusStop, UniqueStop } from '@/types';

interface AutoCompleteProps {
  label: string;
  variant: 'start' | 'end';
  stops: UniqueStop[];
  selectedStop: BusStop | null;
  routePlanned: boolean;
  onSelect: (stop: BusStop | null) => void;
}

export default function AutoComplete({
  label,
  variant,
  stops,
  selectedStop,
  routePlanned,
  onSelect,
}: AutoCompleteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!selectedStop) {
      return;
    }

    setQuery(selectedStop.name_en);
  }, [selectedStop]);

  const { results } = useSearch(stops, query);
  const shownResults = useMemo(() => results.slice(0, 8), [results]);

  const selectStop = (stop: UniqueStop) => {
    onSelect(stop);
    setQuery(stop.name_en);
    setOpen(false);
    setActiveIndex(0);
  };

  return (
    <div
      className={`autocomplete autocomplete-${variant} ${routePlanned && selectedStop ? 'autocomplete-planned' : ''}`}
      onFocus={() => setOpen(true)}
      onBlur={() => setTimeout(() => setOpen(false), 100)}
    >
      <label>{label}</label>
      <div className="autocomplete-input-wrap">
        <span className={`waypoint-marker waypoint-marker-${variant}`} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActiveIndex((index) => (index >= shownResults.length - 1 ? 0 : index + 1));
              return;
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((index) => (index <= 0 ? shownResults.length - 1 : index - 1));
              return;
            }
            if (event.key === 'Enter' && shownResults[activeIndex]) {
              event.preventDefault();
              selectStop(shownResults[activeIndex]);
            }
          }}
          placeholder="Search bus stop"
        />
        {query && (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onClick={() => {
              setQuery('');
              onSelect(null);
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>
      {routePlanned && selectedStop && (
        <p className="autocomplete-meta">
          {selectedStop.road_en} · {selectedStop.township_en}
        </p>
      )}

      {open && query.trim().length > 0 && (
        <ul className="autocomplete-results">
          {shownResults.length === 0 && <li className="empty">No stop found</li>}
          {shownResults.map((stop, index) => (
            <li key={`${stop.bus_stop_id}-${stop.name_en}`} className={index === activeIndex ? 'active' : ''}>
              <button type="button" onClick={() => selectStop(stop)}>
                <strong>{stop.name_en}</strong>
                <small>{stop.road_en} · {stop.township_en}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
