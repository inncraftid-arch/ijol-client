import { clientEnv } from '../config/env';
import { supabaseAuthRequest, supabaseRestRequest } from './clientSupabase';

const adminSessionStorageKey = 'ijol_admin_session';

export type AdminSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
  };
};

type SupabaseAuthUser = {
  id: string;
  email?: string;
};

type SupabasePasswordAuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: SupabaseAuthUser;
};

type AdminUserRecord = {
  id: string;
  email: string | null;
};

const toAdminSession = (response: SupabasePasswordAuthResponse): AdminSession => ({
  accessToken: response.access_token,
  refreshToken: response.refresh_token,
  expiresAt: Date.now() + response.expires_in * 1000,
  user: {
    id: response.user.id,
    email: response.user.email || '',
  },
});

export const saveAdminSession = (session: AdminSession) => {
  window.localStorage.setItem(adminSessionStorageKey, JSON.stringify(session));
};

export const clearAdminSession = () => {
  window.localStorage.removeItem(adminSessionStorageKey);
};

export const readStoredAdminSession = (): AdminSession | null => {
  const rawSession = window.localStorage.getItem(adminSessionStorageKey);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AdminSession;
  } catch {
    clearAdminSession();
    return null;
  }
};

export const assertAdminAccess = async (session: AdminSession) => {
  const records = await supabaseRestRequest<AdminUserRecord[]>(
    `admin_users?select=id,email&id=eq.${encodeURIComponent(session.user.id)}&limit=1`,
    { authToken: session.accessToken }
  );

  if (!records.length) {
    throw new Error('Akun ini belum terdaftar sebagai admin IJOL.');
  }
};

export const signInAdmin = async (email: string, password: string) => {
  const response = await supabaseAuthRequest<SupabasePasswordAuthResponse>(
    'token?grant_type=password',
    {
      method: 'POST',
      body: {
        email,
        password,
      },
    }
  );
  const session = toAdminSession(response);

  await assertAdminAccess(session);
  saveAdminSession(session);

  return session;
};

export const refreshAdminSession = async (session: AdminSession) => {
  const response = await supabaseAuthRequest<SupabasePasswordAuthResponse>(
    'token?grant_type=refresh_token',
    {
      method: 'POST',
      body: {
        refresh_token: session.refreshToken,
      },
    }
  );
  const refreshedSession = toAdminSession(response);

  await assertAdminAccess(refreshedSession);
  saveAdminSession(refreshedSession);

  return refreshedSession;
};

export const getValidAdminSession = async () => {
  const storedSession = readStoredAdminSession();

  if (!storedSession) {
    return null;
  }

  if (storedSession.expiresAt > Date.now() + 60_000) {
    try {
      await assertAdminAccess(storedSession);
      return storedSession;
    } catch {
      clearAdminSession();
      return null;
    }
  }

  try {
    return await refreshAdminSession(storedSession);
  } catch {
    clearAdminSession();
    return null;
  }
};

export const signOutAdmin = async (session: AdminSession | null) => {
  if (session?.accessToken && clientEnv.supabaseUrl) {
    await supabaseAuthRequest<null>('logout', {
      method: 'POST',
      authToken: session.accessToken,
    }).catch(() => null);
  }

  clearAdminSession();
};
