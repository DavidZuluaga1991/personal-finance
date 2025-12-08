import { apiClient } from '@/lib/api';
import { endpoints } from '@/lib/api';
import type{ User } from '../types/auth.types';

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<{ user: User; token: string }>(
      endpoints.auth.login,
      {
        email,
        password,
      }
    );
    return {
      token: response.data.token,
      user: response.data.user,
    };
  },
};

