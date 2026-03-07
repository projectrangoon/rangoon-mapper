import { useMemo } from 'react';

import TimelineStep from '@/components/route/TimelineStep';
import { formatRideService, formatWalkTo, getLocalizedStopName, t } from '@/lib/i18n';
import { formatImperialWalkDistance } from '@/lib/units';
import type { AppLocale, BusStop, RoutePath } from '@/types';

interface TimelineProps {
  locale: AppLocale;
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
  locale: AppLocale;
}

const getStopLabel = (locale: AppLocale, step: RoutePath['path'][number]): string =>
  getLocalizedStopName(step, locale) || String(step.bus_stop_id ?? '');

const getIntermediateStops = (steps: RoutePath['path'], locale: AppLocale): string[] => {
  const stopNames = steps.map((step) => getStopLabel(locale, step));
  const dedupedStopNames = stopNames.filter((stopName, index) => stopName !== stopNames[index - 1]);
  return dedupedStopNames.slice(1, -1);
};

export const buildTimeline = (
  locale: AppLocale,
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
      title: formatWalkTo(locale, getStopLabel(locale, first)),
      subtitle: formatImperialWalkDistance(first.distance ?? 0),
      color: '#d8d8d8',
      locale,
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
      from = getStopLabel(locale, stop);
      runStartIndex = index;
    }

    const next = routePath.path[index + 1];
    if (!next || next.service_name !== currentService) {
      const runStops = routePath.path.slice(runStartIndex, index + 1);
      segments.push({
        kind: 'bus',
        title: formatRideService(locale, currentService),
        subtitle: `${from} → ${getStopLabel(locale, stop)}`,
        color: stop.color,
        stops: getIntermediateStops(runStops, locale),
        locale,
      });
    }
  });

  if (last && endStop && endStop.bus_stop_id !== last.bus_stop_id) {
    segments.push({
      kind: 'walk',
      title: formatWalkTo(locale, getLocalizedStopName(endStop, locale)),
      subtitle: formatImperialWalkDistance(last.distance ?? 0),
      color: '#d8d8d8',
      locale,
    });
  }

  return segments;
};

export default function Timeline({ locale, routePath, startStop, endStop }: TimelineProps) {
  const segments = useMemo(() => buildTimeline(locale, routePath, startStop, endStop), [locale, routePath, startStop, endStop]);

  if (segments.length === 0) {
    return <p className="timeline-empty">{t(locale, 'timelineEmpty')}</p>;
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
