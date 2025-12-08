'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { isJWTExpired } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Home() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!hasHydrated) return;

    if (token) {
      if (isJWTExpired(token)) {
        logout();
        router.push('/login');
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
  }, [hasHydrated, token, router, logout]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
