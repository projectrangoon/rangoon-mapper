import AutoComplete from '@/components/route/AutoComplete';
import MetricsGrid from '@/components/route/MetricsGrid';
import Timeline from '@/components/route/Timeline';
import Panel from '@/components/ui/Panel';
import { ArrowDown, ArrowRight } from 'lucide-react';
import type { BusStop, RoutePath, UniqueStop } from '@/types';

interface RoutePanelProps {
  uniqueStops: UniqueStop[];
  startStop: BusStop | null;
  endStop: BusStop | null;
  routePath: RoutePath | null;
  isCalculating: boolean;
  onSelectStart: (stop: BusStop | null) => void;
  onSelectEnd: (stop: BusStop | null) => void;
}

export default function RoutePanel({
  uniqueStops,
  startStop,
  endStop,
  routePath,
  isCalculating,
  onSelectStart,
  onSelectEnd,
}: RoutePanelProps) {
  const routePlanned = Boolean(routePath && startStop && endStop);
  const destinationLabel = routePlanned && endStop ? endStop.name_en : 'Choose destination';

  return (
    <Panel className="route-panel">
      <header className="route-panel-header">
        <div>
          <p className="route-panel-kicker">Routing To</p>
          <h2>{destinationLabel}</h2>
          <p className="panel-caption">Find the quickest Yangon bus journey across connected services.</p>
        </div>
        <div className="route-live-badge">Live</div>
      </header>

      {routePlanned && startStop && endStop && (
        <section className="route-waypoint-card" aria-label="Planned Route Waypoints">
          <div className="route-waypoint-block route-waypoint-block-start">
            <small>Start</small>
            <div className="route-waypoint-inline">
              <span className="route-waypoint-glyph route-waypoint-glyph-start" aria-hidden="true" />
              <strong>{startStop.name_en}</strong>
            </div>
            <span>{startStop.road_en} · {startStop.township_en}</span>
          </div>
          <div className="route-waypoint-arrow" aria-hidden="true">
            <ArrowRight size={16} className="route-waypoint-arrow-desktop" />
            <ArrowDown size={16} className="route-waypoint-arrow-mobile" />
          </div>
          <div className="route-waypoint-block route-waypoint-block-end">
            <small>Destination</small>
            <div className="route-waypoint-inline">
              <span className="route-waypoint-glyph route-waypoint-glyph-end" aria-hidden="true" />
              <strong>{endStop.name_en}</strong>
            </div>
            <span>{endStop.road_en} · {endStop.township_en}</span>
          </div>
        </section>
      )}

      <div className="route-inputs">
        <AutoComplete
          label="From"
          variant="start"
          stops={uniqueStops}
          selectedStop={startStop}
          routePlanned={routePlanned}
          onSelect={onSelectStart}
        />
        <AutoComplete
          label="To"
          variant="end"
          stops={uniqueStops}
          selectedStop={endStop}
          routePlanned={routePlanned}
          onSelect={onSelectEnd}
        />
      </div>

      {isCalculating && <p className="calculating">Calculating shortest path...</p>}

      <MetricsGrid routePath={routePath} />
      <div className="timeline-header">
        <span>Guidance</span>
      </div>
      <Timeline routePath={routePath} startStop={startStop} endStop={endStop} />
    </Panel>
  );
}
