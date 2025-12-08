'use client';

import Cookies from 'js-cookie';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  return () => {
    logout();
    Cookies.remove('token');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    router.push('/login');
  };
};

