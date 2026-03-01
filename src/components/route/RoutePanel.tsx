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
  return (
    <Panel className="route-panel">
      <h2>Route Planner</h2>
      <p className="panel-caption">Find the quickest Yangon bus journey across connected services.</p>

      <div className="route-inputs">
        <AutoComplete label="From" stops={uniqueStops} selectedStop={startStop} onSelect={onSelectStart} />
        <AutoComplete label="To" stops={uniqueStops} selectedStop={endStop} onSelect={onSelectEnd} />
      </div>

      {isCalculating && <p className="calculating">Calculating shortest path...</p>}

      <MetricsGrid routePath={routePath} />
      <Timeline routePath={routePath} startStop={startStop} endStop={endStop} />
    </Panel>
  );
}
