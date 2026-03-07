import BusServiceItem from '@/components/bus/BusServiceItem';
import Panel from '@/components/ui/Panel';
import { t } from '@/lib/i18n';
import type { AppLocale, BusServicesMap } from '@/types';

interface BusLinesPanelProps {
  locale: AppLocale;
  busServices: BusServicesMap;
  selectedServices: Set<string>;
  expandedService: string | null;
  onToggleService: (serviceId: string) => void;
  onExpandService: (serviceId: string | null) => void;
}

export default function BusLinesPanel({
  locale,
  busServices,
  selectedServices,
  expandedService,
  onToggleService,
  onExpandService,
}: BusLinesPanelProps) {
  const serviceIds = Object.keys(busServices).sort((a, b) => Number(a) - Number(b));

  return (
    <Panel className="lines-panel">
      <h2>{t(locale, 'busLines')}</h2>
      <p className="panel-caption">{t(locale, 'busLinesCaption')}</p>

      <ul className="services-list">
        {serviceIds.map((serviceId) => {
          const service = busServices[serviceId];
          if (!service) {
            return null;
          }

          return (
            <BusServiceItem
              key={serviceId}
              locale={locale}
              serviceId={serviceId}
              service={service}
              checked={selectedServices.has(serviceId)}
              expanded={expandedService === serviceId}
              onToggle={() => onToggleService(serviceId)}
              onExpand={() => onExpandService(expandedService === serviceId ? null : serviceId)}
            />
          );
        })}
      </ul>
    </Panel>
  );
}
