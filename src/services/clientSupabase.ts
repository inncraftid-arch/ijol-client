import { assertSupabaseEnv, clientEnv } from '../config/env';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  authToken?: string;
};

const buildHeaders = (headers?: Record<string, string>, authToken?: string) => ({
  apikey: clientEnv.supabaseAnonKey,
  Authorization: `Bearer ${authToken || clientEnv.supabaseAnonKey}`,
  'Content-Type': 'application/json',
  ...headers,
});

const parseResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      typeof data?.message === 'string'
        ? data.message
        : typeof data?.msg === 'string'
          ? data.msg
          : response.statusText;
    const details = typeof data?.details === 'string' ? ` ${data.details}` : '';
    const hint = typeof data?.hint === 'string' ? ` ${data.hint}` : '';
    const code = typeof data?.code === 'string' ? ` (${data.code})` : '';

    throw new Error(
      `${message || `Request Supabase gagal dengan status ${response.status}`}${code}${details}${hint}`
    );
  }

  return data as T;
};

export const invokeSupabaseFunction = async <T>(functionName: string, body: unknown): Promise<T> => {
  assertSupabaseEnv();

  const response = await fetch(`${clientEnv.supabaseUrl}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  return parseResponse<T>(response);
};

export const supabaseRestRequest = async <T>(
  path: string,
  { method = 'GET', body, headers, authToken }: RequestOptions = {}
): Promise<T> => {
  assertSupabaseEnv();

  const response = await fetch(`${clientEnv.supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: buildHeaders(headers, authToken),
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseResponse<T>(response);
};

export const supabaseAuthRequest = async <T>(
  path: string,
  { method = 'GET', body, headers, authToken }: RequestOptions = {}
): Promise<T> => {
  assertSupabaseEnv();

  const response = await fetch(`${clientEnv.supabaseUrl}/auth/v1/${path}`, {
    method,
    headers: buildHeaders(headers, authToken),
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseResponse<T>(response);
};
