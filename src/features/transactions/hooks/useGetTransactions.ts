'use client';

import { useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';
import { useAuthStore } from '@/lib/store/slices/authSlice';

export const useGetTransactions = () => {
  const setList = useTransactionStore((s) => s.setList);
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  useEffect(() => {
    // Esperar a que Zustand haya hidratado y que haya un token disponible
    if (!hasHydrated) {
      return;
    }

    // Si no hay token después de la hidratación, no intentar hacer la petición
    if (!token) {
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const data = await transactionService.list();
        if (mounted) setList(data);
      } catch (err: any) {
        // Solo loggear errores que no sean de autenticación (403/401)
        // Estos errores son esperados si el token aún no está listo
        if (err?.message && !err.message.includes('403') && !err.message.includes('401')) {
          console.error('Error fetching transactions', err);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setList, token, hasHydrated]);
};

