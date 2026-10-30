import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@supabase/supabase-js';
import {
  createProfileAvatarUrl,
  getProfileAvatarFileError,
  ProfileAvatarError,
  replaceProfileAvatar,
} from '../src/services/profileAvatar';

const mocks = vi.hoisted(() => {
  const profileQuery: Record<string, any> = {};
  profileQuery.update = vi.fn(() => profileQuery);
  profileQuery.eq = vi.fn(() => profileQuery);
  profileQuery.select = vi.fn(() => profileQuery);
  profileQuery.single = vi.fn();
  profileQuery.maybeSingle = vi.fn();

  const storageBucket: Record<string, any> = {};
  storageBucket.upload = vi.fn();
  storageBucket.list = vi.fn();
  storageBucket.remove = vi.fn();
  storageBucket.createSignedUrl = vi.fn();

  const client = {
    from: vi.fn(() => profileQuery),
    storage: { from: vi.fn(() => storageBucket) },
  };
  return { client, profileQuery, storageBucket };
});

vi.mock('../src/lib/supabaseClient', () => ({ supabaseClient: mocks.client }));

const user = { id: 'test-user-id' } as User;
const baseProfile = {
  user_id: user.id,
  display_name: 'Mabda Learner',
  avatar_path: `${user.id}/avatar.png`,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

function pngFile(name = 'avatar.png') {
  return new File([
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]),
  ], name, { type: 'image/png' });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.storageBucket.upload.mockResolvedValue({ data: { path: baseProfile.avatar_path }, error: null });
  mocks.storageBucket.list.mockResolvedValue({ data: [], error: null });
  mocks.storageBucket.remove.mockResolvedValue({ data: [], error: null });
  mocks.profileQuery.single.mockResolvedValue({ data: baseProfile, error: null });
  mocks.profileQuery.maybeSingle.mockResolvedValue({ data: baseProfile, error: null });
});

describe('Profile avatar storage', () => {
  it('accepts only supported image MIME types and the 5 MiB size limit', () => {
    expect(getProfileAvatarFileError(pngFile())).toBeNull();
    expect(getProfileAvatarFileError(new File(['x'], 'note.txt', { type: 'text/plain' }))).toBe('unsupported-type');
    expect(getProfileAvatarFileError(new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' }))).toBe('file-too-large');
  });

  it('rejects an image whose file signature does not match its MIME type', async () => {
    const fakePng = new File(['not an image'], 'fake.png', { type: 'image/png' });
    await expect(replaceProfileAvatar(user, fakePng, null)).rejects.toMatchObject({ code: 'invalid-image' });
    expect(mocks.storageBucket.upload).not.toHaveBeenCalled();
  });

  it('uploads under the authenticated user and stores the path in profiles', async () => {
    const result = await replaceProfileAvatar(user, pngFile(), null);
    expect(mocks.client.storage.from).toHaveBeenCalledWith('profile-avatars');
    expect(mocks.storageBucket.upload).toHaveBeenCalledWith(
      `${user.id}/avatar.png`,
      expect.any(File),
      expect.objectContaining({ contentType: 'image/png', upsert: true }),
    );
    expect(mocks.profileQuery.update).toHaveBeenCalledWith(expect.objectContaining({ avatar_path: `${user.id}/avatar.png` }));
    expect(result.profile.avatar_path).toBe(`${user.id}/avatar.png`);
    expect(result.cleanupWarning).toBe(false);
  });

  it('removes obsolete owned avatar extensions after the profile points to the new object', async () => {
    const previousPath = `${user.id}/avatar.jpg`;
    mocks.profileQuery.single.mockResolvedValue({ data: { ...baseProfile, avatar_path: `${user.id}/avatar.png` }, error: null });
    mocks.storageBucket.list.mockResolvedValue({
      data: [{ name: 'avatar.jpg' }, { name: 'avatar.png' }, { name: 'other-file.png' }, { name: '../avatar.webp' }],
      error: null,
    });

    await replaceProfileAvatar(user, pngFile(), previousPath);
    expect(mocks.storageBucket.remove).toHaveBeenCalledWith([previousPath]);
  });

  it('reports cleanup trouble without misreporting a successful profile update', async () => {
    mocks.profileQuery.single.mockResolvedValue({ data: baseProfile, error: null });
    mocks.storageBucket.list.mockResolvedValue({ data: null, error: { message: 'temporary storage error' } });

    const result = await replaceProfileAvatar(user, pngFile(), null);
    expect(result.profile.avatar_path).toBe(baseProfile.avatar_path);
    expect(result.cleanupWarning).toBe(true);
  });

  it('does not leave a newly uploaded object behind when profile persistence fails', async () => {
    mocks.profileQuery.single.mockResolvedValue({ data: null, error: { message: 'update rejected' } });
    mocks.profileQuery.maybeSingle.mockResolvedValue({ data: { ...baseProfile, avatar_path: null }, error: null });

    await expect(replaceProfileAvatar(user, pngFile(), null)).rejects.toMatchObject({ code: 'profile-update-failed' });
    expect(mocks.storageBucket.remove).toHaveBeenCalledWith([`${user.id}/avatar.png`]);
  });

  it('creates signed URLs only for a path owned by the current account', async () => {
    mocks.storageBucket.createSignedUrl.mockResolvedValue({ data: { signedUrl: 'https://example.test/signed-avatar' }, error: null });
    await expect(createProfileAvatarUrl(user.id, `${user.id}/avatar.webp`)).resolves.toBe('https://example.test/signed-avatar');
    await expect(createProfileAvatarUrl(user.id, 'another-user/avatar.png')).resolves.toBeNull();
    expect(mocks.storageBucket.createSignedUrl).toHaveBeenCalledWith(`${user.id}/avatar.webp`, 3600);
  });

  it('uses typed failures rather than uploading without a signed-in user', async () => {
    await expect(replaceProfileAvatar({ id: '' } as User, pngFile(), null)).rejects.toBeInstanceOf(ProfileAvatarError);
    expect(mocks.storageBucket.upload).not.toHaveBeenCalled();
  });
});
