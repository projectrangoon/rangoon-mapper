import { ChevronDown, ChevronRight } from 'lucide-react';

import ServiceStops from '@/components/bus/ServiceStops';
import type { BusService } from '@/types';

interface BusServiceItemProps {
  serviceId: string;
  service: BusService;
  checked: boolean;
  expanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
}

export default function BusServiceItem({
  serviceId,
  service,
  checked,
  expanded,
  onToggle,
  onExpand,
}: BusServiceItemProps) {
  return (
    <li className="service-item">
      <div className="service-row">
        <button type="button" className="service-toggle" onClick={onToggle} aria-label={`Toggle ${serviceId}`}>
          <span className={checked ? 'dot checked' : 'dot'} style={{ borderColor: service.color, backgroundColor: checked ? service.color : 'transparent' }} />
        </button>

        <span className="service-badge" style={{ backgroundColor: service.color }}>
          {serviceId}
        </span>

        <button type="button" className="service-expand" onClick={onExpand}>
          <span>{service.service_name}</span>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {expanded && <ServiceStops stops={service.stops} />}
    </li>
  );
}
