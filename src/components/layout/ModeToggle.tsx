import type { AppMode } from '@/types';

interface ModeToggleProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="mode-toggle">
      <button type="button" className={mode === 'route' ? 'active' : ''} onClick={() => onChange('route')}>
        Route
      </button>
      <button type="button" className={mode === 'lines' ? 'active' : ''} onClick={() => onChange('lines')}>
        Lines
      </button>
    </div>
  );
}
