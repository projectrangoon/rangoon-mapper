import { t } from '@/lib/i18n';
import type { RoutePath } from '@/types';
import type { AppLocale } from '@/types';
import { formatImperialDistance } from '@/lib/units';

interface MetricsGridProps {
  locale: AppLocale;
  routePath: RoutePath | null;
}

const estimateMinutes = (routePath: RoutePath): number => {
  const distanceTime = (routePath.currDistance / 18) * 60;
  const transferPenalty = routePath.currTransfers * 4;
  const base = 3;
  return Math.max(1, Math.round(distanceTime + transferPenalty + base));
};

export default function MetricsGrid({ locale, routePath }: MetricsGridProps) {
  if (!routePath) {
    return (
      <div className="metrics-grid">
        <article className="metric-card">
          <h4>{t(locale, 'eta')}</h4>
          <p>--</p>
        </article>
        <article className="metric-card">
          <h4>{t(locale, 'distance')}</h4>
          <p>--</p>
        </article>
        <article className="metric-card">
          <h4>{t(locale, 'transfers')}</h4>
          <p>--</p>
        </article>
      </div>
    );
  }

  return (
    <div className="metrics-grid">
      <article className="metric-card metric-card-highlight">
        <h4>{t(locale, 'eta')}</h4>
        <p>{estimateMinutes(routePath)} min</p>
      </article>
      <article className="metric-card">
        <h4>{t(locale, 'distance')}</h4>
        <p>{formatImperialDistance(routePath.currDistance)}</p>
      </article>
      <article className="metric-card">
        <h4>{t(locale, 'transfers')}</h4>
        <p>{routePath.currTransfers}</p>
      </article>
    </div>
  );
}
