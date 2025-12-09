'use client';

import { useEffect, useRef } from 'react';
import { transactionService } from '../services/transactionService';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';
import { useAuthStore } from '@/lib/store/slices/authSlice';

export const useGetTransactions = () => {
  const setList = useTransactionStore((s) => s.setList);
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const user = useAuthStore((s) => s.user);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token || !user) {
      return;
    }

    if (isFetchingRef.current) {
      return;
    }

    let mounted = true;
    isFetchingRef.current = true;

    (async () => {
      try {
        const data = await transactionService.list();
        if (mounted) {
          setList(data);
        }
      } catch (err: any) {
        const apiError = err as any;
        const isAuthError = 
          apiError?.status === 401 ||
          apiError?.status === 403 ||
          err?.message?.includes('403') ||
          err?.message?.includes('401') ||
          err?.message?.includes('No autorizado') ||
          err?.message?.includes('Permisos insuficientes') ||
          err?.message?.includes('Token inválido') ||
          err?.message?.includes('Token expirado');

        if (apiError?.status === 401 && mounted) {
          window.location.href = '/login';
          return;
        }

        if (!isAuthError && err?.message) {
          console.error('Error fetching transactions', err);
        }
      } finally {
        if (mounted) {
          isFetchingRef.current = false;
        }
      }
    })();

    return () => {
      mounted = false;
      isFetchingRef.current = false;
    };
  }, [setList, token, hasHydrated, user]);
};

