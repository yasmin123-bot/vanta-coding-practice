import { useState } from 'react';
import type { Locale } from '../i18n/messages';
import { getStudentPortalCopy } from '../i18n/studentPortal';
import { useAuth } from '../auth/AuthProvider';

type StudentNavActionsProps = {
  locale: Locale;
  onNavigate?: () => void;
};

function StudentNavActions({ locale, onNavigate }: StudentNavActionsProps) {
  const { user, loading, signOut } = useAuth();
  const copy = getStudentPortalCopy(locale);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(false);
    try {
      await signOut();
      onNavigate?.();
      window.location.assign('/login');
    } catch {
      setSignOutError(true);
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) return <span className="student-nav-loading" aria-hidden="true" />;

  return (
    <div className="student-nav-actions">
      {user ? (
        <>
          <a className="student-nav-link" href="/dashboard" onClick={onNavigate}>{copy.nav.dashboard}</a>
          <a className="student-nav-link" href="/profile" onClick={onNavigate}>{copy.nav.profile}</a>
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
