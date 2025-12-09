'use client';

import Cookies from 'js-cookie';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const clearTransactions = useTransactionStore((s) => s.setList);
  const router = useRouter();

  return () => {
    // Limpiar transacciones antes de hacer logout
    clearTransactions([]);
    logout();
    Cookies.remove('token');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    router.push('/login');
  };
};

