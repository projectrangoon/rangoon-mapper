import BusServiceItem from '@/components/bus/BusServiceItem';
import Panel from '@/components/ui/Panel';
import { cn } from '@/lib/cn';
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
      <h2 className={cn('m-0 text-[1.55rem] font-[650] leading-[1.05] tracking-[-0.04em]', locale === 'my' && 'font-["Noto_Sans_Myanmar","Inter",sans-serif] tracking-[0]')}>
        {t(locale, 'busLines')}
      </h2>
      <p className={cn('mt-[0.35rem] mb-0 text-[0.875rem] text-[var(--ink-dim)]', locale === 'my' && 'font-["Noto_Sans_Myanmar","Inter",sans-serif] leading-[1.55]')}>
        {t(locale, 'busLinesCaption')}
      </p>

      <ul className="m-0 mt-4 grid max-h-[min(62dvh,620px)] list-none gap-0 overflow-auto p-0">
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
