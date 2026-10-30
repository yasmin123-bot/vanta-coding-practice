import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabaseClient, supabaseSetupState } from '../lib/supabaseClient';

type AuthContextValue = {
  user: User | null;
  recoverySession: boolean;
  loading: boolean;
  signingOut: boolean;
  serviceError: boolean;
  setupState: typeof supabaseSetupState;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const RECOVERY_SESSION_KEY = 'vanta.auth.password-recovery-user';

function persistRecoveryUser(userId: string | null) {
  try {
    if (userId) window.sessionStorage.setItem(RECOVERY_SESSION_KEY, userId);
    else window.sessionStorage.removeItem(RECOVERY_SESSION_KEY);
  } catch {
    // Recovery continues for the current view even if browser storage is unavailable.
  }
}

function isRecoveryUser(userId: string | undefined): boolean {
  if (!userId) return false;
  try {
    return window.sessionStorage.getItem(RECOVERY_SESSION_KEY) === userId;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [recoverySession, setRecoverySession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [serviceError, setServiceError] = useState(false);

  useEffect(() => {
    const client = supabaseClient;
    if (!client) {
      setLoading(false);
      return;
    }

    let active = true;
    let authEventVersion = 0;
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      authEventVersion += 1;
      if (!active) return;
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY' && session?.user.id) {
        setRecoverySession(true);
        persistRecoveryUser(session.user.id);
      }
      if (event === 'USER_UPDATED') {
        setRecoverySession(false);
        persistRecoveryUser(null);
      }
      if (event === 'SIGNED_OUT') {
        setRecoverySession(false);
        persistRecoveryUser(null);
      }
      setServiceError(false);
      setLoading(false);
    });

    void client.auth.getSession().then(({ data, error }) => {
      if (!active || authEventVersion > 0) return;
      if (error) {
        setServiceError(true);
        setUser(null);
        setRecoverySession(false);
        persistRecoveryUser(null);
      } else {
        setUser(data.session?.user ?? null);
        setRecoverySession(isRecoveryUser(data.session?.user.id));
        setServiceError(false);
      }
      setLoading(false);
    }).catch(() => {
      if (!active || authEventVersion > 0) return;
      setServiceError(true);
      setUser(null);
      setRecoverySession(false);
      persistRecoveryUser(null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (!supabaseClient) throw new Error('Supabase is not configured.');
    setSigningOut(true);
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      setUser(null);
      setRecoverySession(false);
      persistRecoveryUser(null);
    } catch (error) {
      setSigningOut(false);
      throw error;
    }
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    recoverySession,
    loading,
    signingOut,
    serviceError,
    setupState: supabaseSetupState,
    signOut,
  }), [user, recoverySession, loading, signingOut, serviceError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
