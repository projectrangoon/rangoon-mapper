import { getLocalizedStopName } from '@/lib/i18n';
import type { AdjacencyNode } from '@/types';
import type { AppLocale } from '@/types';

interface ServiceStopsProps {
  locale: AppLocale;
  stops: AdjacencyNode[];
}

export default function ServiceStops({ locale, stops }: ServiceStopsProps) {
  return (
    <ol className="service-stops">
      {stops.map((stop) => (
        <li key={`${stop.bus_stop_id}-${stop.sequence}`}>
          <span className="service-stop-index">{stop.sequence}</span>
          <span className="service-stop-node" aria-hidden="true" />
          <div className="service-stop-copy">
            <strong>{getLocalizedStopName(stop, locale)}</strong>
            {((locale === 'my' ? stop.name_en : stop.name_mm) || '').trim() &&
              (locale === 'my' ? stop.name_en : stop.name_mm) !== getLocalizedStopName(stop, locale) && (
                <small>{locale === 'my' ? stop.name_en : stop.name_mm}</small>
              )}
          </div>
        </li>
      ))}
    </ol>
  );
}
