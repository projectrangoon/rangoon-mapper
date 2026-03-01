import { Crosshair, Maximize2, Star } from 'lucide-react';

import Compass from '@/components/ui/Compass';
import Fab from '@/components/ui/Fab';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface ControlClusterProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onResetBearing: () => void;
  onResetView: () => void;
  onTogglePanel: () => void;
}

export default function ControlCluster({
  theme,
  onToggleTheme,
  onResetBearing,
  onResetView,
  onTogglePanel,
}: ControlClusterProps) {
  return (
    <div className="control-cluster">
      <div className="control-column">
        <Fab onClick={onTogglePanel} aria-label="Toggle Panel">
          <Star size={18} />
        </Fab>
        <Fab onClick={onResetView} aria-label="Reset View">
          <Maximize2 size={18} />
        </Fab>
        <Fab onClick={onResetBearing} aria-label="Reset Bearing">
          <Crosshair size={18} />
        </Fab>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      <Compass />
    </div>
  );
}
