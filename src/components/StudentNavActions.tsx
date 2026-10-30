import { useState } from 'react';
import type { Locale } from '../i18n/messages';
import { getStudentPortalCopy } from '../i18n/studentPortal';
import { useAuth } from '../auth/AuthProvider';
import { resetIntroSeen } from '../utils/introState';

type StudentNavActionsProps = {
  locale: Locale;
  onNavigate?: () => void;
  compact?: boolean;
};

function StudentNavActions({ locale, onNavigate, compact = false }: StudentNavActionsProps) {
  const { user, loading, signingOut: authSigningOut, signOut } = useAuth();
  const copy = getStudentPortalCopy(locale);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(false);
    try {
      await signOut();
      resetIntroSeen();
      onNavigate?.();
      window.location.replace('/');
    } catch {
      setSignOutError(true);
    } finally {
      setSigningOut(false);
    }
  };

  if (loading || authSigningOut) {
    return <span className="student-nav-loading" role={authSigningOut ? 'status' : undefined} aria-hidden={authSigningOut ? undefined : true}>
      {authSigningOut ? copy.nav.signingOut : null}
    </span>;
  }

  return (
    <div className={`student-nav-actions ${compact ? 'student-nav-actions--compact' : ''}`}>
      {user ? (
        <>
          {!compact && <a className="student-nav-link" href="/dashboard" onClick={onNavigate}>{copy.nav.dashboard}</a>}
          {!compact && <a className="student-nav-link" href="/profile" onClick={onNavigate}>{copy.nav.profile}</a>}
          <button className="student-nav-logout" type="button" onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? copy.nav.signingOut : copy.nav.logout}
          </button>
        </>
      ) : (
        <>
          <a className="student-nav-link" href="/login" onClick={onNavigate}>{copy.nav.login}</a>
          <a className="student-nav-signup" href="/signup" onClick={onNavigate}>{copy.nav.signup}</a>
        </>
      )}
      {signOutError && <span className="student-nav-error" role="status">{copy.common.serviceError}</span>}
    </div>
  );
}

export default StudentNavActions;
