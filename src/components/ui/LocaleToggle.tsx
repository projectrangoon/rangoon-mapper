import Fab from '@/components/ui/Fab';
import type { AppLocale } from '@/types';

interface LocaleToggleProps {
  locale: AppLocale;
  onToggle: () => void;
}

export default function LocaleToggle({ locale, onToggle }: LocaleToggleProps) {
  return (
    <Fab onClick={onToggle} aria-label="Toggle Language" className="fab-locale">
      <span>{locale === 'en' ? 'မြန်' : 'EN'}</span>
    </Fab>
  );
}
