import { afterEach, describe, expect, it, vi } from 'vitest';
import { hasSeenIntro, INTRO_SEEN_STORAGE_KEY, markIntroSeen, resetIntroSeen } from '../src/utils/introState';

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

describe('intro completion state', () => {
  it('is unseen by default and is remembered locally after Next', () => {
    expect(hasSeenIntro()).toBe(false);
    markIntroSeen();
    expect(localStorage.getItem(INTRO_SEEN_STORAGE_KEY)).toBe('true');
    expect(hasSeenIntro()).toBe(true);
  });

  it('recovers from session storage if persistent storage is unavailable', () => {
    const originalSetItem = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      if (this === localStorage) throw new Error('Persistent storage unavailable');
      return originalSetItem.call(this, key, value);
    });
    markIntroSeen();
    expect(sessionStorage.getItem(INTRO_SEEN_STORAGE_KEY)).toBe('true');
    expect(hasSeenIntro()).toBe(true);
  });

  it('does not fail the current experience when both storages are blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage unavailable'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage unavailable'); });
    expect(() => markIntroSeen()).not.toThrow();
    expect(hasSeenIntro()).toBe(false);
  });

  it('clears the intro completion flag from both browser storages after logout', () => {
    markIntroSeen();
    expect(hasSeenIntro()).toBe(true);
    resetIntroSeen();
    expect(localStorage.getItem(INTRO_SEEN_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(INTRO_SEEN_STORAGE_KEY)).toBeNull();
    expect(hasSeenIntro()).toBe(false);
  });
});
