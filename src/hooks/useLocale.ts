import { useEffect, useMemo, useState } from 'react';

import type { AppLocale } from '@/types';

const LOCALE_STORAGE_KEY = 'rangoon-locale-preference';

const getSystemLocale = (): AppLocale => {
  return window.navigator.language.toLowerCase().startsWith('my') ? 'my' : 'en';
};

export const useLocale = () => {
  const [locale, setLocale] = useState<AppLocale>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === 'en' || saved === 'my') {
      setLocale(saved);
      return;
    }

    setLocale(getSystemLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'my' ? 'my' : 'en';
    document.documentElement.dataset.locale = locale;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  return useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale: () => setLocale((current) => (current === 'en' ? 'my' : 'en')),
    }),
    [locale],
  );
};
