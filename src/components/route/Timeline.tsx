import { useMemo } from 'react';

import TimelineStep from '@/components/route/TimelineStep';
import { formatImperialWalkDistance } from '@/lib/units';
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
  stops?: string[];
}

const getStopLabel = (busStopId?: number, nameEn?: string): string => nameEn ?? String(busStopId ?? '');

const getIntermediateStops = (steps: RoutePath['path']): string[] => {
  const stopNames = steps.map((step) => getStopLabel(step.bus_stop_id, step.name_en));
  const dedupedStopNames = stopNames.filter((stopName, index) => stopName !== stopNames[index - 1]);
  return dedupedStopNames.slice(1, -1);
};

export const buildTimeline = (
  routePath: RoutePath | null,
  startStop: BusStop | null,
  endStop: BusStop | null,
): RouteSegment[] => {
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
      subtitle: formatImperialWalkDistance(first.distance ?? 0),
      color: '#d8d8d8',
    });
  }

  let runStartIndex = -1;
  let currentService = -1;
  let from = '';
  routePath.path.forEach((stop, index) => {
    if (stop.service_name === 0) {
      return;
    }

    if (currentService !== stop.service_name) {
      currentService = stop.service_name;
      from = getStopLabel(stop.bus_stop_id, stop.name_en);
      runStartIndex = index;
    }

    const next = routePath.path[index + 1];
    if (!next || next.service_name !== currentService) {
      const runStops = routePath.path.slice(runStartIndex, index + 1);
      segments.push({
        kind: 'bus',
        title: `Take YBS ${currentService}`,
        subtitle: `${from} → ${getStopLabel(stop.bus_stop_id, stop.name_en)}`,
        color: stop.color,
        stops: getIntermediateStops(runStops),
      });
    }
  });

  if (last && endStop && endStop.bus_stop_id !== last.bus_stop_id) {
    segments.push({
      kind: 'walk',
      title: `Walk to ${endStop.name_en}`,
      subtitle: formatImperialWalkDistance(last.distance ?? 0),
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
        <TimelineStep
          key={`${segment.title}-${index}`}
          {...segment}
          connectToNext={segment.kind === 'bus' && segments[index + 1]?.kind === 'bus'}
        />
      ))}
      </ol>
    </div>
  );
}
