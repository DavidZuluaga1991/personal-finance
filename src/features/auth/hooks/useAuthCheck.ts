'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { isJWTExpired } from '@/lib/utils';

export const useAuthCheck = () => {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && token) {
      if (isJWTExpired(token)) {
        logout();
        router.push('/login');
      }
    }
  }, [hasHydrated, token, logout, router]);
};

