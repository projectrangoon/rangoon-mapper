import { Crosshair, Maximize2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import Compass from '@/components/ui/Compass';
import Fab from '@/components/ui/Fab';
import LocaleToggle from '@/components/ui/LocaleToggle';
import ThemeToggle from '@/components/ui/ThemeToggle';
import type { AppLocale } from '@/types';

interface ControlClusterProps {
  locale: AppLocale;
  theme: 'dark' | 'light';
  panelOpen: boolean;
  onToggleLocale: () => void;
  onToggleTheme: () => void;
  onResetBearing: () => void;
  onResetView: () => void;
  onTogglePanel: () => void;
}

export default function ControlCluster({
  locale,
  theme,
  panelOpen,
  onToggleLocale,
  onToggleTheme,
  onResetBearing,
  onResetView,
  onTogglePanel,
}: ControlClusterProps) {
  return (
    <div className="control-cluster">
      <div className="control-column">
        <Fab onClick={onTogglePanel} aria-label={panelOpen ? 'Hide Panel' : 'Show Panel'} active={panelOpen}>
          {panelOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </Fab>
        <Fab onClick={onResetView} aria-label="Reset View">
          <Maximize2 size={18} />
        </Fab>
        <Fab onClick={onResetBearing} aria-label="Reset Bearing">
          <Crosshair size={18} />
        </Fab>
        <LocaleToggle locale={locale} onToggle={onToggleLocale} />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      <Compass />
    </div>
  );
}
