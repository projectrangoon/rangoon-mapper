import { act, renderHook } from '@testing-library/react';

import { useLocale } from '@/hooks/useLocale';

describe('useLocale', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = 'en';
    delete document.documentElement.dataset.locale;
    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: 'en-SG',
    });
  });

  it('falls back to the browser locale when no preference is saved', () => {
    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: 'my-MM',
    });

    const { result } = renderHook(() => useLocale());

    expect(result.current.locale).toBe('my');
    expect(document.documentElement.lang).toBe('my');
    expect(window.localStorage.getItem('rangoon-locale-preference')).toBe('my');
  });

  it('restores and toggles the saved locale', () => {
    window.localStorage.setItem('rangoon-locale-preference', 'my');

    const { result } = renderHook(() => useLocale());

    expect(result.current.locale).toBe('my');

    act(() => {
      result.current.toggleLocale();
    });

    expect(result.current.locale).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(window.localStorage.getItem('rangoon-locale-preference')).toBe('en');
  });
});
