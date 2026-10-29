import { resolveVantaRoute } from '../content/learningSystem';

const AUTH_ONLY_ROUTES = new Set([
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/auth/callback',
]);

export function safeReturnPath(candidate: string | null | undefined, fallback = '/dashboard'): string {
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//') || candidate.includes('\\')) {
    return fallback;
  }

  try {
    const url = new URL(candidate, window.location.origin);
    if (url.origin !== window.location.origin || AUTH_ONLY_ROUTES.has(url.pathname)) return fallback;

    const route = resolveVantaRoute(url.pathname);
    if (route.kind === 'not-found') return fallback;

    return url.pathname;
  } catch {
    return fallback;
  }
}
