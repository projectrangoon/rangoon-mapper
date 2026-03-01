import { act, renderHook } from '@testing-library/react';

import { useTheme } from '@/hooks/useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('light');
    delete document.documentElement.dataset.theme;
  });

  it('starts from system and toggles to explicit mode', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.preference).toBe('system');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.preference).toBe('dark');
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(window.localStorage.getItem('rangoon-theme-preference')).toBe('dark');
  });

  it('restores saved preference from localStorage', () => {
    window.localStorage.setItem('rangoon-theme-preference', 'dark');

    const { result } = renderHook(() => useTheme());

    expect(result.current.preference).toBe('dark');
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
