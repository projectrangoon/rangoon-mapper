import { Bus, Footprints } from 'lucide-react';

interface TimelineStepProps {
  kind: 'bus' | 'walk';
  title: string;
  subtitle: string;
  color?: string;
}

export default function TimelineStep({ kind, title, subtitle, color }: TimelineStepProps) {
  return (
    <li className="timeline-step">
      <span className="dot" style={{ backgroundColor: color ?? '#999' }}>
        {kind === 'bus' ? <Bus size={12} /> : <Footprints size={12} />}
      </span>
      <div className="content">
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </div>
    </li>
  );
}
