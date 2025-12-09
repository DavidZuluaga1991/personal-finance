import type { ApiError, ApiResponse } from '@/types/common.types';
import { endpoints } from './endpoints';

class ApiClient {
  private baseURL: string;

  constructor() {
    if (typeof window !== 'undefined') {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) {
        this.baseURL = apiUrl;
      } else {
        this.baseURL = 'http://localhost:3003';
      }
    } else {
      this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = this.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          message: response.statusText,
        }));
        (error as any).status = response.status;
        
        if (response.status === 401 && typeof window !== 'undefined') {
          try {
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
              localStorage.removeItem('auth-storage');
            }
          } catch (e) {
          }
        }
        
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw { message: error.message } as ApiError;
      }
      throw error;
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.token;
        if (token && typeof token === 'string' && token.trim().length > 0) {
          return token;
        }
      }
    } catch (error) {
      console.warn('Error reading auth token from localStorage:', error);
      return null;
    }
    return null;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export { endpoints };

