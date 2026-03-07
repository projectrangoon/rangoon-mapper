import AutoComplete from '@/components/route/AutoComplete';
import MetricsGrid from '@/components/route/MetricsGrid';
import Timeline from '@/components/route/Timeline';
import Panel from '@/components/ui/Panel';
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

  return (
    <Panel className="route-panel">
      <h2>Route Planner</h2>
      <p className="panel-caption">Find the quickest Yangon bus journey across connected services.</p>

      {routePlanned && startStop && endStop && (
        <section className="route-waypoint-card" aria-label="Planned Route Waypoints">
          <div className="route-waypoint-row route-waypoint-start">
            <span className="route-waypoint-glyph route-waypoint-glyph-start" aria-hidden="true" />
            <div className="route-waypoint-copy">
              <small>Start</small>
              <strong>{startStop.name_en}</strong>
              <span>{startStop.road_en} · {startStop.township_en}</span>
            </div>
          </div>
          <div className="route-waypoint-divider" aria-hidden="true" />
          <div className="route-waypoint-row route-waypoint-end">
            <span className="route-waypoint-glyph route-waypoint-glyph-end" aria-hidden="true" />
            <div className="route-waypoint-copy">
              <small>Destination</small>
              <strong>{endStop.name_en}</strong>
              <span>{endStop.road_en} · {endStop.township_en}</span>
            </div>
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
      <Timeline routePath={routePath} startStop={startStop} endStop={endStop} />
    </Panel>
  );
}
