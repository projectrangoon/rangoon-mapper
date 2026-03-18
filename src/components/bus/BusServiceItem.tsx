import { ChevronDown, ChevronRight } from 'lucide-react';

import ServiceStops from '@/components/bus/ServiceStops';
import { MY_FONT, cn } from '@/lib/cn';
import { normalizeServiceName } from '@/lib/serviceNames';
import type { AppLocale, BusService } from '@/types';

interface BusServiceItemProps {
  locale: AppLocale;
  serviceId: string;
  service: BusService;
  checked: boolean;
  expanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
}

export default function BusServiceItem({
  locale,
  serviceId,
  service,
  checked,
  expanded,
  onToggle,
  onExpand,
}: BusServiceItemProps) {
  return (
    <li className={cn('service-item', checked && 'service-item-checked', expanded && 'service-item-expanded')}>
      <div className="service-item-row">
        <button
          type="button"
          className="service-select"
          onClick={onToggle}
          aria-pressed={checked}
          aria-label={`Toggle ${serviceId}`}
        >
          <span
            className="service-select-dot"
            style={{ borderColor: service.color, backgroundColor: checked ? service.color : 'transparent' }}
          />
          <span
            className="service-id-chip"
            style={{ backgroundColor: service.color }}
          >
            {serviceId}
          </span>
        </button>

        <button
          type="button"
          className="service-expand"
          onClick={onExpand}
          aria-expanded={expanded}
        >
          <span
            className={cn(
              'service-name',
              locale === 'my' && MY_FONT,
            )}
          >
            {normalizeServiceName(service.service_name)}
          </span>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {expanded && <ServiceStops locale={locale} stops={service.stops} />}
    </li>
  );
}
