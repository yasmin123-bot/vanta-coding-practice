import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type AppNavigationContextValue = {
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
};

const AppNavigationContext = createContext<AppNavigationContextValue | null>(null);

export function AppNavigationProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);
  const value = useMemo(() => ({ menuOpen, openMenu, closeMenu, toggleMenu }), [menuOpen, openMenu, closeMenu, toggleMenu]);

  return <AppNavigationContext.Provider value={value}>{children}</AppNavigationContext.Provider>;
}

export function useAppNavigation() {
  const value = useContext(AppNavigationContext);
  if (!value) throw new Error('useAppNavigation must be used within AppNavigationProvider');
  return value;
}
