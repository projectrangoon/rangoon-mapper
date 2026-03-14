import { MY_FONT, cn } from '@/lib/cn';
import { getLocalizedStopName } from '@/lib/i18n';
import type { AdjacencyNode } from '@/types';
import type { AppLocale } from '@/types';

interface ServiceStopsProps {
  locale: AppLocale;
  stops: AdjacencyNode[];
}

export default function ServiceStops({ locale, stops }: ServiceStopsProps) {
  return (
    <ol className="relative m-0 grid list-none gap-0 px-0 pb-1 pt-1.5 pl-12 before:absolute before:bottom-2 before:left-9 before:top-2 before:w-px before:bg-[color:color-mix(in_srgb,var(--ink)_12%,transparent)]">
      {stops.map((stop) => {
        const localizedName = getLocalizedStopName(stop, locale);
        const alternateName = (locale === 'my' ? stop.name_en : stop.name_mm) ?? '';
        const showAlternate = alternateName.trim() !== '' && alternateName !== localizedName;

        return (
          <li
            key={`${stop.bus_stop_id}-${stop.sequence}`}
            className={cn(
              'grid grid-cols-[2rem_0.85rem_1fr] items-start gap-3 py-[0.42rem] text-[0.86rem] leading-[1.35]',
              locale === 'my' && 'leading-[1.55]',
            )}
          >
            <span className="pt-[0.08rem] text-right font-['Space_Mono',monospace] text-[0.76rem] text-[var(--ink-light)]">
              {stop.sequence}
            </span>
            <span
              aria-hidden="true"
              className="relative z-[1] mt-[0.28rem] h-2 w-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_28%,transparent)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--surface)_96%,transparent)]"
            />
            <div className="min-w-0 pt-[0.02rem] pb-[0.05rem]">
              <strong
                className={cn(
                  'block text-[0.94rem] font-[620] leading-[1.28] text-[var(--ink)]',
                  locale === 'my' && MY_FONT,
                )}
              >
                {localizedName}
              </strong>
              {showAlternate && (
                <small
                  className={cn(
                    'mt-[0.08rem] block text-[0.77rem] text-[var(--ink-dim)]',
                    locale === 'my' && MY_FONT + ' text-[0.78rem]',
                  )}
                >
                  {alternateName}
                </small>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
