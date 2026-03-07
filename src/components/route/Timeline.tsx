import { useMemo } from 'react';

import TimelineStep from '@/components/route/TimelineStep';
import type { BusStop, RoutePath } from '@/types';

interface TimelineProps {
  routePath: RoutePath | null;
  startStop: BusStop | null;
  endStop: BusStop | null;
}

interface RouteSegment {
  kind: 'bus' | 'walk';
  title: string;
  subtitle: string;
  color?: string;
}

const buildTimeline = (routePath: RoutePath | null, startStop: BusStop | null, endStop: BusStop | null): RouteSegment[] => {
  if (!routePath || routePath.path.length === 0) {
    return [];
  }

  const segments: RouteSegment[] = [];
  const [first] = routePath.path;
  const last = routePath.path[routePath.path.length - 1];

  if (first && startStop && startStop.bus_stop_id !== first.bus_stop_id) {
    segments.push({
      kind: 'walk',
      title: `Walk to ${first.name_en ?? first.bus_stop_id}`,
      subtitle: `${Math.round((first.distance ?? 0) * 1000)} m`,
      color: '#d8d8d8',
    });
  }

  let currentService = -1;
  let from = '';
  routePath.path.forEach((stop, index) => {
    if (stop.service_name === 0) {
      return;
    }

    if (currentService !== stop.service_name) {
      currentService = stop.service_name;
      from = stop.name_en ?? String(stop.bus_stop_id);
    }

    const next = routePath.path[index + 1];
    if (!next || next.service_name !== currentService) {
      segments.push({
        kind: 'bus',
        title: `Take YBS ${currentService}`,
        subtitle: `${from} → ${stop.name_en ?? stop.bus_stop_id}`,
        color: stop.color,
      });
    }
  });

  if (last && endStop && endStop.bus_stop_id !== last.bus_stop_id) {
    segments.push({
      kind: 'walk',
      title: `Walk to ${endStop.name_en}`,
      subtitle: `${Math.round((last.distance ?? 0) * 1000)} m`,
      color: '#d8d8d8',
    });
  }

  return segments;
};

export default function Timeline({ routePath, startStop, endStop }: TimelineProps) {
  const segments = useMemo(() => buildTimeline(routePath, startStop, endStop), [routePath, startStop, endStop]);

  if (segments.length === 0) {
    return <p className="timeline-empty">Select start and end stops to get route details.</p>;
  }

  return (
    <div className="timeline-shell">
      <div className="timeline-guide" aria-hidden="true" />
      <ol className="timeline">
      {segments.map((segment, index) => (
        <TimelineStep key={`${segment.title}-${index}`} {...segment} />
      ))}
      </ol>
    </div>
  );
}
