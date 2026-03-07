import type { RoutePath } from '@/types';

interface MetricsGridProps {
  routePath: RoutePath | null;
}

const estimateMinutes = (routePath: RoutePath): number => {
  const distanceTime = (routePath.currDistance / 18) * 60;
  const transferPenalty = routePath.currTransfers * 4;
  const base = 3;
  return Math.max(1, Math.round(distanceTime + transferPenalty + base));
};

export default function MetricsGrid({ routePath }: MetricsGridProps) {
  if (!routePath) {
    return (
      <div className="metrics-grid">
        <article className="metric-card">
          <h4>ETA</h4>
          <p>--</p>
        </article>
        <article className="metric-card">
          <h4>Distance</h4>
          <p>--</p>
        </article>
        <article className="metric-card">
          <h4>Transfers</h4>
          <p>--</p>
        </article>
      </div>
    );
  }

  return (
    <div className="metrics-grid">
      <article className="metric-card metric-card-highlight">
        <h4>ETA</h4>
        <p>{estimateMinutes(routePath)} min</p>
      </article>
      <article className="metric-card">
        <h4>Distance</h4>
        <p>{routePath.currDistance.toFixed(2)} km</p>
      </article>
      <article className="metric-card">
        <h4>Transfers</h4>
        <p>{routePath.currTransfers}</p>
      </article>
    </div>
  );
}
