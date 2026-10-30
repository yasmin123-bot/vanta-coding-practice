import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { readSavedTheme, ThemeProvider, useTheme, THEME_STORAGE_KEY } from '../src/state/ThemeProvider';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root | undefined;
let host: HTMLDivElement | undefined;
function Control() {
  const { theme, toggleTheme } = useTheme();
  return createElement('button', { onClick: toggleTheme }, theme);
}
function mount() {
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  act(() => root!.render(createElement(ThemeProvider, null, createElement(Control))));
}
afterEach(() => {
  if (root) act(() => root!.unmount());
  vi.restoreAllMocks();
  host?.remove(); root = undefined; localStorage.clear(); delete document.documentElement.dataset.theme;
});
describe('central manual theme', () => {
  it('defaults to light, invalid stored values do not change it', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'invalid'); expect(readSavedTheme()).toBe('light');
    mount(); expect(document.documentElement.dataset.theme).toBe('light');
  });
  it('restores manual dark and persists the next choice', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark'); mount(); expect(document.documentElement.dataset.theme).toBe('dark');
    act(() => host!.querySelector('button')!.click());
    expect(document.documentElement.dataset.theme).toBe('light'); expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });
  it('synchronizes another tab selection without changing locale', () => {
    localStorage.setItem('vanta-locale', 'ar'); mount(); localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: THEME_STORAGE_KEY, newValue: 'dark' })));
    expect(document.documentElement.dataset.theme).toBe('dark'); expect(localStorage.getItem('vanta-locale')).toBe('ar');
  });
  it('defaults safely if storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage disabled'); });
    expect(readSavedTheme()).toBe('light'); mount(); expect(document.documentElement.dataset.theme).toBe('light');
  });
  it('keeps manual switching usable when persistence is blocked', () => {
    mount(); vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Quota unavailable'); });
    act(() => host!.querySelector('button')!.click());
    expect(document.documentElement.dataset.theme).toBe('dark'); expect(host!.textContent).toBe('dark');
  });
});
