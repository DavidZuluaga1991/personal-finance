import { apiClient } from './client';

export async function authFetch<T>(endpoint: string): Promise<T> {
  const response = await apiClient.get<T>(endpoint);
  return response.data;
}

export async function authFetchPost<T>(
  endpoint: string,
  data?: unknown
): Promise<T> {
  const response = await apiClient.post<T>(endpoint, data);
  return response.data;
}

export async function authFetchPut<T>(
  endpoint: string,
  data?: unknown
): Promise<T> {
  const response = await apiClient.put<T>(endpoint, data);
  return response.data;
}

export async function authFetchDelete<T>(endpoint: string): Promise<T> {
  const response = await apiClient.delete<T>(endpoint);
  return response.data;
}

