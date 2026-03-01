import { useEffect, useMemo, useState } from 'react';

export type ThemePreference = 'dark' | 'light' | 'system';

const THEME_STORAGE_KEY = 'rangoon-theme-preference';

const getSystemTheme = (): Exclude<ThemePreference, 'system'> => {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const resolveTheme = (theme: ThemePreference): Exclude<ThemePreference, 'system'> => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const useTheme = () => {
  const [preference, setPreference] = useState<ThemePreference>('system');

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
    if (saved === 'dark' || saved === 'light' || saved === 'system') {
      setPreference(saved);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      if (preference === 'system') {
        const root = document.documentElement;
        root.classList.toggle('light', resolveTheme('system') === 'light');
      }
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [preference]);

  useEffect(() => {
    const resolvedTheme = resolveTheme(preference);
    document.documentElement.classList.toggle('light', resolvedTheme === 'light');
    document.documentElement.dataset.theme = resolvedTheme;

    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  }, [preference]);

  const value = useMemo(
    () => ({
      preference,
      theme: resolveTheme(preference),
      setPreference,
      toggleTheme: () => setPreference((current) => (resolveTheme(current) === 'dark' ? 'light' : 'dark')),
    }),
    [preference],
  );

  return value;
};
