import { X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useSearch } from '@/hooks/useSearch';
import { formatStopMeta, getLocalizedStopName, t } from '@/lib/i18n';
import type { AppLocale, BusStop, UniqueStop } from '@/types';

interface AutoCompleteProps {
  label: string;
  locale: AppLocale;
  variant: 'start' | 'end';
  stops: UniqueStop[];
  selectedStop: BusStop | null;
  routePlanned: boolean;
  onSelect: (stop: BusStop | null) => void;
}

export default function AutoComplete({
  label,
  locale,
  variant,
  stops,
  selectedStop,
  routePlanned,
  onSelect,
}: AutoCompleteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const shouldRefocusOnClear = useRef(false);

  useEffect(() => {
    if (!selectedStop) {
      setQuery('');
      setActiveIndex(0);

      if (shouldRefocusOnClear.current) {
        shouldRefocusOnClear.current = false;
        window.requestAnimationFrame(() => {
          inputRef.current?.focus();
          setOpen(true);
        });
      } else {
        setOpen(false);
      }

      return;
    }

    setQuery(getLocalizedStopName(selectedStop, locale));
  }, [locale, selectedStop]);

  const { results } = useSearch(stops, query);
  const shownResults = useMemo(() => results.slice(0, 8), [results]);

  const selectStop = (stop: UniqueStop) => {
    onSelect(stop);
    setQuery(getLocalizedStopName(stop, locale));
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
          ref={inputRef}
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
          placeholder={t(locale, 'searchBusStopPlaceholder')}
        />
        {query && (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={() => {
              setQuery('');
              setActiveIndex(0);
              shouldRefocusOnClear.current = true;
              inputRef.current?.focus();
              setOpen(true);
              onSelect(null);
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>
      {routePlanned && selectedStop && (
        <p className="autocomplete-meta">
          {formatStopMeta(selectedStop, locale)}
        </p>
      )}

      {open && query.trim().length > 0 && (
        <ul className="autocomplete-results">
          {shownResults.length === 0 && <li className="empty">{t(locale, 'searchNoStop')}</li>}
          {shownResults.map((stop, index) => (
            <li key={`${stop.bus_stop_id}-${stop.name_en}`} className={index === activeIndex ? 'active' : ''}>
              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => selectStop(stop)}
              >
                <strong>{getLocalizedStopName(stop, locale)}</strong>
                <small>{formatStopMeta(stop, locale)}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
