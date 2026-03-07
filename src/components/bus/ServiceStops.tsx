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
          <span>{stop.sequence}.</span>
          <div>
            <strong>{getLocalizedStopName(stop, locale)}</strong>
            <small>{locale === 'my' ? stop.name_en : stop.name_mm}</small>
          </div>
        </li>
      ))}
    </ol>
  );
}
