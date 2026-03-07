import type { CSSProperties } from 'react';
import { Bus, Footprints } from 'lucide-react';

interface TimelineStepProps {
  kind: 'bus' | 'walk';
  title: string;
  subtitle: string;
  color?: string;
  stops?: string[];
}

export default function TimelineStep({ kind, title, subtitle, color, stops = [] }: TimelineStepProps) {
  return (
    <li className="timeline-step">
      <span className="timeline-marker" style={{ '--timeline-accent': color ?? '#999' } as CSSProperties}>
        <span className="timeline-dot" />
      </span>
      <span className="timeline-icon-card">
        {kind === 'bus' ? <Bus size={12} /> : <Footprints size={12} />}
      </span>
      <div className="content">
        <span className="timeline-eyebrow">{kind === 'bus' ? 'Transit leg' : 'Walk leg'}</span>
        <strong>{title}</strong>
        <small>{subtitle}</small>
        {kind === 'bus' && stops.length > 0 && (
          <ul className="timeline-stop-list" aria-label={`${title} stops`}>
            {stops.map((stop, index) => (
              <li key={`${stop}-${index}`}>{stop}</li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
