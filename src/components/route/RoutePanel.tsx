import AutoComplete from '@/components/route/AutoComplete';
import MetricsGrid from '@/components/route/MetricsGrid';
import Timeline from '@/components/route/Timeline';
import Panel from '@/components/ui/Panel';
import { getLocalizedStopName, t } from '@/lib/i18n';
import { ArrowLeftRight } from 'lucide-react';
import type { AppLocale, BusStop, RoutePath, UniqueStop } from '@/types';

interface RoutePanelProps {
  locale: AppLocale;
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
  locale,
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
  const destinationLabel = routePlanned && endStop ? getLocalizedStopName(endStop, locale) : t(locale, 'chooseDestination');

  return (
    <Panel className="route-panel">
      <header className="route-panel-header">
        <div>
          <p className="route-panel-kicker">{t(locale, 'routingTo')}</p>
          <h2>{destinationLabel}</h2>
          {!routePlanned && (
            <p className="panel-caption">{t(locale, 'quickestJourneyCaption')}</p>
          )}
        </div>
        <div className="route-live-badge">{t(locale, 'live')}</div>
      </header>

      <div className="route-inputs-header">
        <span>{t(locale, 'waypoints')}</span>
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
          label={t(locale, 'from')}
          locale={locale}
          variant="start"
          stops={uniqueStops}
          selectedStop={startStop}
          routePlanned={routePlanned}
          onSelect={onSelectStart}
        />
        <AutoComplete
          label={t(locale, 'to')}
          locale={locale}
          variant="end"
          stops={uniqueStops}
          selectedStop={endStop}
          routePlanned={routePlanned}
          onSelect={onSelectEnd}
        />
      </div>

      {isCalculating && <p className="calculating">{t(locale, 'calculating')}</p>}

      <MetricsGrid locale={locale} routePath={routePath} />
      <div className="timeline-header">
        <span>{t(locale, 'guidance')}</span>
      </div>
      <Timeline locale={locale} routePath={routePath} startStop={startStop} endStop={endStop} />
    </Panel>
  );
}
