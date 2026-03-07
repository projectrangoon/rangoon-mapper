import AutoComplete from '@/components/route/AutoComplete';
import MetricsGrid from '@/components/route/MetricsGrid';
import Timeline from '@/components/route/Timeline';
import Panel from '@/components/ui/Panel';
import { ArrowLeftRight } from 'lucide-react';
import type { BusStop, RoutePath, UniqueStop } from '@/types';

interface RoutePanelProps {
  uniqueStops: UniqueStop[];
  startStop: BusStop | null;
  endStop: BusStop | null;
  routePath: RoutePath | null;
  isCalculating: boolean;
  onSelectStart: (stop: BusStop | null) => void;
  onSelectEnd: (stop: BusStop | null) => void;
  onSwapStops: () => void;
}

export default function RoutePanel({
  uniqueStops,
  startStop,
  endStop,
  routePath,
  isCalculating,
  onSelectStart,
  onSelectEnd,
  onSwapStops,
}: RoutePanelProps) {
  const routePlanned = Boolean(routePath && startStop && endStop);
  const destinationLabel = routePlanned && endStop ? endStop.name_en : 'Choose destination';

  return (
    <Panel className="route-panel">
      <header className="route-panel-header">
        <div>
          <p className="route-panel-kicker">Routing To</p>
          <h2>{destinationLabel}</h2>
          {!routePlanned && (
            <p className="panel-caption">Find the quickest Yangon bus journey across connected services.</p>
          )}
        </div>
        <div className="route-live-badge">Live</div>
      </header>

      <div className="route-inputs-header">
        <span>Waypoints</span>
        {startStop && endStop && (
          <button
            type="button"
            className="route-waypoint-arrow route-waypoint-swap route-waypoint-swap-inline"
            aria-label="Reverse route"
            onClick={onSwapStops}
          >
            <ArrowLeftRight size={16} className="route-waypoint-arrow-swap" />
          </button>
        )}
      </div>

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
