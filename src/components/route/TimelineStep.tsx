import { useState, type CSSProperties } from 'react';
import { Bus, ChevronDown, ChevronRight, Footprints } from 'lucide-react';

import { formatStopCount, t } from '@/lib/i18n';
import type { AppLocale } from '@/types';

interface TimelineStepProps {
  kind: 'bus' | 'walk';
  title: string;
  subtitle: string;
  color?: string;
  stops?: string[];
  connectToNext?: boolean;
  locale: AppLocale;
}

export default function TimelineStep({
  kind,
  title,
  subtitle,
  color,
  stops = [],
  connectToNext = false,
  locale,
}: TimelineStepProps) {
  const [expanded, setExpanded] = useState(true);
  const isBusLeg = kind === 'bus';
  const hasIntermediateStops = isBusLeg && stops.length > 0;
  const stopsId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-stops`;

  return (
    <li
      className={`timeline-step${hasIntermediateStops && expanded ? ' timeline-step-has-rail' : ''}`}
      style={{ '--timeline-leg-color': color ?? '#999' } as CSSProperties}
    >
      <span className="timeline-marker" style={{ '--timeline-accent': color ?? '#999' } as CSSProperties}>
        <span className="timeline-dot" />
      </span>
      <span className="timeline-icon-card">
        {isBusLeg ? <Bus size={12} /> : <Footprints size={12} />}
      </span>
      <div className="content">
        <span className="timeline-eyebrow">{isBusLeg ? t(locale, 'transitLeg') : t(locale, 'walkLeg')}</span>
        <strong>{title}</strong>
        <small>{subtitle}</small>
        {hasIntermediateStops && (
          <div className="timeline-leg-shell">
            <button
              type="button"
              className="timeline-leg-toggle"
              aria-expanded={expanded}
              aria-controls={stopsId}
              onClick={() => setExpanded((current) => !current)}
            >
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span>{formatStopCount(locale, stops.length)}</span>
            </button>
          </div>
        )}
      </div>
      {hasIntermediateStops && expanded && (
        <div
          id={stopsId}
          className={`timeline-leg-details${connectToNext ? ' timeline-leg-details-connect-next' : ''}`}
        >
          <span className="timeline-leg-line" aria-hidden="true" />
          <span className="timeline-leg-icon-spacer" aria-hidden="true" />
          <ul className="timeline-stop-list" aria-label={`${title} stops`}>
            {stops.map((stop, index) => (
              <li key={`${stop}-${index}`} className="timeline-stop-item">
                <span className="timeline-stop-node" aria-hidden="true" />
                <span className="timeline-stop-icon-spacer" aria-hidden="true" />
                <span>{stop}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
