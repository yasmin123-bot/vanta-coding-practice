import type { User } from '@supabase/supabase-js';
import { supabaseClient } from '../lib/supabaseClient';
import type { Database } from '../lib/database.types';

export const PROFILE_AVATAR_BUCKET = 'profile-avatars';
export const PROFILE_AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const PROFILE_AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type ProfileAvatarErrorCode =
  | 'file-too-large'
  | 'unsupported-type'
  | 'invalid-image'
  | 'not-signed-in'
  | 'upload-failed'
  | 'profile-update-failed';

export class ProfileAvatarError extends Error {
  constructor(readonly code: ProfileAvatarErrorCode) {
    super(code);
    this.name = 'ProfileAvatarError';
  }
}

export type ProfileAvatarUpdate = {
  profile: Database['public']['Tables']['profiles']['Row'];
  cleanupWarning: boolean;
};

const extensionByMime: Record<(typeof PROFILE_AVATAR_MIME_TYPES)[number], string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function getProfileAvatarFileError(file: File): ProfileAvatarErrorCode | null {
  if (file.size <= 0 || !PROFILE_AVATAR_MIME_TYPES.includes(file.type as (typeof PROFILE_AVATAR_MIME_TYPES)[number])) {
    return 'unsupported-type';
  }
  if (file.size > PROFILE_AVATAR_MAX_BYTES) return 'file-too-large';
  return null;
}

async function hasExpectedImageSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (file.type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === 'image/png') return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => bytes[index] === byte);
  if (file.type === 'image/webp') {
    return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
      && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  }
  return false;
}

function requireClient() {
  if (!supabaseClient) throw new ProfileAvatarError('upload-failed');
  return supabaseClient;
}

function isOwnedAvatarPath(userId: string, path: string | null | undefined): path is string {
  return Boolean(path && path.startsWith(`${userId}/avatar.`) && /^[^/]+\/avatar\.(jpg|png|webp)$/.test(path));
}

export async function createProfileAvatarUrl(userId: string, path: string | null): Promise<string | null> {
  if (!path || !isOwnedAvatarPath(userId, path)) return null;
  const client = requireClient();
  const { data, error } = await client.storage.from(PROFILE_AVATAR_BUCKET).createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

async function removeObsoleteAvatars(userId: string, currentPath: string, previousPath: string | null): Promise<boolean> {
  const client = requireClient();
  const storage = client.storage.from(PROFILE_AVATAR_BUCKET);
  const obsolete = new Set<string>();
  if (isOwnedAvatarPath(userId, previousPath) && previousPath !== currentPath) obsolete.add(previousPath);

  let cleanupWarning = false;
  try {
    const { data: entries, error: listError } = await storage.list(userId, { limit: 100 });
    cleanupWarning ||= Boolean(listError);
    if (!listError) {
    for (const entry of entries ?? []) {
      if (/^avatar\.(jpg|png|webp)$/.test(entry.name)) {
        const fullPath = `${userId}/${entry.name}`;
        if (fullPath !== currentPath) obsolete.add(fullPath);
      }
    }
    }
  } catch {
    cleanupWarning = true;
  }

  if (!obsolete.size) return cleanupWarning;
  try {
    const { error: removeError } = await storage.remove([...obsolete]);
    cleanupWarning ||= Boolean(removeError);
  } catch {
    cleanupWarning = true;
  }
  return cleanupWarning;
}

export async function replaceProfileAvatar(user: User, file: File, previousPath: string | null): Promise<ProfileAvatarUpdate> {
  if (!user.id) throw new ProfileAvatarError('not-signed-in');
  const fileError = getProfileAvatarFileError(file);
  if (fileError) throw new ProfileAvatarError(fileError);
  if (!(await hasExpectedImageSignature(file))) throw new ProfileAvatarError('invalid-image');

  const client = requireClient();
  const extension = extensionByMime[file.type as (typeof PROFILE_AVATAR_MIME_TYPES)[number]];
  const nextPath = `${user.id}/avatar.${extension}`;
  const storage = client.storage.from(PROFILE_AVATAR_BUCKET);
  const { error: uploadError } = await storage.upload(nextPath, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) throw new ProfileAvatarError('upload-failed');

  const { data: profile, error: profileError } = await client
    .from('profiles')
    .update({ avatar_path: nextPath, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .select('user_id,display_name,avatar_path,created_at,updated_at')
    .single();

  let confirmedProfile = profile;
  if (profileError || !profile) {
    // A network error can arrive after the database committed. Read back the path before cleanup
    // so we never delete the object that a profile may already reference.
    const { data: currentProfile } = await client
      .from('profiles')
      .select('user_id,display_name,avatar_path,created_at,updated_at')
      .eq('user_id', user.id)
      .maybeSingle();
    if (currentProfile?.avatar_path === nextPath) {
      confirmedProfile = currentProfile;
    } else {
      if (nextPath !== previousPath) {
        try { await storage.remove([nextPath]); } catch { /* Preserve the profile-update error. */ }
      }
      throw new ProfileAvatarError('profile-update-failed');
    }
  }

  if (!confirmedProfile) throw new ProfileAvatarError('profile-update-failed');
  const cleanupWarning = await removeObsoleteAvatars(user.id, nextPath, previousPath);
  return { profile: confirmedProfile, cleanupWarning };
}
