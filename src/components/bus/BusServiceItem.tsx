import { cva } from 'class-variance-authority';
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

const serviceExpandVariants = cva(
  'flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left transition-colors',
  {
    variants: {
      expanded: {
        true: 'bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)]',
        false: 'hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)]',
      },
    },
  },
);

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
    <li className="relative py-1 first:pt-0 before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-[color:color-mix(in_srgb,var(--ink)_9%,transparent)] first:before:hidden">
      <div className="grid grid-cols-[auto_auto_1fr] items-center gap-2">
        <button
          type="button"
          className="border-0 bg-transparent p-0 text-inherit"
          onClick={onToggle}
          aria-label={`Toggle ${serviceId}`}
        >
          <span
            className="inline-block h-[0.9rem] w-[0.9rem] rounded-full border-2"
            style={{ borderColor: service.color, backgroundColor: checked ? service.color : 'transparent' }}
          />
        </button>

        <span
          className="min-w-[2.5rem] rounded-full px-3 py-2 text-center font-['Space_Mono',monospace] text-[1.5rem] leading-none font-bold text-white"
          style={{ backgroundColor: service.color }}
        >
          {serviceId}
        </span>

        <button
          type="button"
          className={serviceExpandVariants({ expanded })}
          onClick={onExpand}
        >
          <span
            className={cn(
              'min-w-0 flex-1 text-[0.95rem] font-medium leading-[1.35] text-[var(--ink)]',
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
