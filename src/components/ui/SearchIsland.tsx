import { Command, Search } from 'lucide-react';
import { forwardRef, useMemo, useState } from 'react';

import { formatStopMeta, getLocalizedStopName, t } from '@/lib/i18n';
import type { AppLocale } from '@/types';
import type { UniqueStop } from '@/types';

interface SearchIslandProps {
  locale: AppLocale;
  query: string;
  results: UniqueStop[];
  onQueryChange: (value: string) => void;
  onSelect: (stop: UniqueStop) => void;
}

const SearchIsland = forwardRef<HTMLInputElement, SearchIslandProps>(function SearchIsland(
  { locale, query, results, onQueryChange, onSelect },
  ref,
) {
  const [open, setOpen] = useState(false);

  const shownResults = useMemo(() => results.slice(0, 8), [results]);

  return (
    <div
      className="search-island"
      data-open={open && query.trim().length > 0 ? 'true' : 'false'}
      onFocus={() => setOpen(true)}
      onBlur={() => setTimeout(() => setOpen(false), 120)}
    >
      <div className="search-icon-shell">
        <Search size={16} className="search-icon" />
      </div>
      <input
        ref={ref}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={t(locale, 'searchStopsPlaceholder')}
        aria-label={t(locale, 'searchStopsAria')}
      />
      <div className="search-kbd">
        <Command size={12} />K
      </div>

      {open && query.trim().length > 0 && (
        <ul className="search-results">
          {shownResults.length === 0 && <li className="empty">{t(locale, 'searchNoMatch')}</li>}
          {shownResults.map((stop) => (
            <li key={stop.bus_stop_id}>
              <button type="button" onClick={() => onSelect(stop)}>
                <strong>{getLocalizedStopName(stop, locale)}</strong>
                <small>{formatStopMeta(stop, locale)}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default SearchIsland;
