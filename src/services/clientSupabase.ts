import { assertSupabaseEnv, clientEnv } from '../config/env';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
};

const buildHeaders = (headers?: Record<string, string>) => ({
  apikey: clientEnv.supabaseAnonKey,
  Authorization: `Bearer ${clientEnv.supabaseAnonKey}`,
  'Content-Type': 'application/json',
  ...headers,
});

const parseResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = typeof data?.message === 'string' ? data.message : response.statusText;
    throw new Error(message || 'Request Supabase gagal.');
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
  { method = 'GET', body, headers }: RequestOptions = {}
): Promise<T> => {
  assertSupabaseEnv();

  const response = await fetch(`${clientEnv.supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: buildHeaders(headers),
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseResponse<T>(response);
};
