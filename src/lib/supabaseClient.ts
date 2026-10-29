import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const projectUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';

function isUnsafeKey(key: string): boolean {
  if (key.startsWith('sb_secret_')) return true;

  const payload = key.split('.')[1];
  if (!payload) return false;

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
    const claims: unknown = JSON.parse(decoded);
    return Boolean(
      claims &&
      typeof claims === 'object' &&
      'role' in claims &&
      (claims as { role?: unknown }).role === 'service_role',
    );
  } catch {
    return false;
  }
}

function isPublicKey(key: string): boolean {
  if (key.startsWith('sb_publishable_')) return key.length > 'sb_publishable_'.length;
  const payload = key.split('.')[1];
  if (!payload) return false;

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
    const claims: unknown = JSON.parse(decoded);
    return Boolean(
      claims &&
      typeof claims === 'object' &&
      'role' in claims &&
      (claims as { role?: unknown }).role === 'anon',
    );
  } catch {
    return false;
  }
}

function isValidProjectUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

export type SupabaseSetupState = 'ready' | 'missing' | 'invalid-url' | 'unsafe-key' | 'invalid-key';

export const supabaseSetupState: SupabaseSetupState = !projectUrl || !publishableKey
  ? 'missing'
  : !isValidProjectUrl(projectUrl)
    ? 'invalid-url'
    : isUnsafeKey(publishableKey)
      ? 'unsafe-key'
      : !isPublicKey(publishableKey)
        ? 'invalid-key'
        : 'ready';

export const supabaseClient: SupabaseClient<Database> | null = supabaseSetupState === 'ready'
  ? createClient<Database>(projectUrl, publishableKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // This browser-only SPA must support email links opened outside the signup tab/browser.
        flowType: 'implicit',
        persistSession: true,
      },
    })
  : null;
