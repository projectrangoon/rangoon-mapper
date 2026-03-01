import { MoonStar, Sun } from 'lucide-react';

import Fab from '@/components/ui/Fab';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <Fab onClick={onToggle} aria-label="Toggle Theme">
      {theme === 'dark' ? <Sun size={18} /> : <MoonStar size={18} />}
    </Fab>
  );
}
