import type { ReactNode } from 'react';

interface AppLayoutProps {
  mapArea: ReactNode;
  topSearch: ReactNode;
  leftPanel: ReactNode;
  controls: ReactNode;
}

export default function AppLayout({ mapArea, topSearch, leftPanel, controls }: AppLayoutProps) {
  return (
    <div className="layout-root">
      <div className="layout-map">{mapArea}</div>
      <div className="layout-hud">
        <div className="layout-top">{topSearch}</div>
        <div className="layout-left">{leftPanel}</div>
      </div>
      <div className="layout-controls">{controls}</div>
    </div>
  );
}
