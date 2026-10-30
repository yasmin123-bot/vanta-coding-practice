export const INTRO_SEEN_STORAGE_KEY = 'mabda-has-seen-intro';
const INTRO_SEEN_VALUE = 'true';

type BrowserStorageName = 'localStorage' | 'sessionStorage';

function getStorage(name: BrowserStorageName): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window[name];
  } catch {
    return null;
  }
}

export function hasSeenIntro(): boolean {
  return (['localStorage', 'sessionStorage'] as const).some((name) => {
    try {
      return getStorage(name)?.getItem(INTRO_SEEN_STORAGE_KEY) === INTRO_SEEN_VALUE;
    } catch {
      return false;
    }
  });
}

export function markIntroSeen(): void {
  for (const name of ['localStorage', 'sessionStorage'] as const) {
    try {
      getStorage(name)?.setItem(INTRO_SEEN_STORAGE_KEY, INTRO_SEEN_VALUE);
    } catch {
      // The in-memory application state still completes onboarding for this visit.
    }
  }
}

export function resetIntroSeen(): void {
  for (const name of ['localStorage', 'sessionStorage'] as const) {
    try {
      getStorage(name)?.removeItem(INTRO_SEEN_STORAGE_KEY);
    } catch {
      // The caller still returns to the public landing page if storage is unavailable.
    }
  }
}
