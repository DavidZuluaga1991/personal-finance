'use client';

import { useAuthStore } from '@/lib/store/slices/authSlice';
import { authService } from '../services/authService';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const loginLocal = useAuthStore((s) => s.loginLocal);
  const router = useRouter();

  return async ({ email, password }: { email: string; password: string }) => {
    const { token, user } = await authService.login(email, password);
    loginLocal(user, token);
    Cookies.set('token', token, { expires: 1 }); // 1 day (24 hours)
    router.push('/dashboard');
  };
};

