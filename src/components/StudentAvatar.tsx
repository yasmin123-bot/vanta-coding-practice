import { useEffect, useState } from 'react';
import type { Locale } from '../i18n/messages';
import { createProfileAvatarUrl } from '../services/profileAvatar';

type StudentAvatarProps = {
  userId: string;
  avatarPath: string | null;
  updatedAt?: string;
  displayName: string;
  locale: Locale;
  size?: 'header' | 'profile';
  previewUrl?: string | null;
  decorative?: boolean;
};

function StudentAvatar({
  userId,
  avatarPath,
  updatedAt,
  displayName,
  locale,
  size = 'profile',
  previewUrl = null,
  decorative = false,
}: StudentAvatarProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [urlFailed, setUrlFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setSignedUrl(null);
    setUrlFailed(false);
    if (!avatarPath || !userId || previewUrl) return () => { active = false; };

    void createProfileAvatarUrl(userId, avatarPath)
      .then((url) => { if (active) setSignedUrl(url); })
      .catch(() => { if (active) setUrlFailed(true); });

    return () => { active = false; };
  }, [avatarPath, previewUrl, updatedAt, userId]);

  const firstCharacter = Array.from(displayName.trim())[0]?.toLocaleUpperCase(locale) ?? '?';
  const imageUrl = urlFailed ? null : (previewUrl ?? signedUrl);

  return (
    <span
      className={`mabda-student-avatar mabda-student-avatar--${size}`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : (locale === 'ar' ? `صورة ${displayName}` : `${displayName}'s avatar`)}
      aria-hidden={decorative ? 'true' : undefined}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => { setUrlFailed(true); setSignedUrl(null); }}
        />
      ) : <span aria-hidden="true">{firstCharacter}</span>}
    </span>
  );
}

export default StudentAvatar;
