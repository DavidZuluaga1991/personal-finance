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
    // Esperar a que Zustand haya hidratado
    if (!hasHydrated) {
      return;
    }

    // Si no hay token o usuario, no intentar hacer la petición
    if (!token || !user) {
      return;
    }

    // Evitar múltiples peticiones simultáneas
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
        // Detectar errores de autenticación de diferentes formas
        const isAuthError = 
          err?.message?.includes('403') ||
          err?.message?.includes('401') ||
          err?.message?.includes('No autorizado') ||
          err?.message?.includes('Permisos insuficientes') ||
          err?.message?.includes('Token inválido') ||
          err?.message?.includes('Token expirado') ||
          (err?.response?.status === 401) ||
          (err?.response?.status === 403);

        // Solo loggear errores que NO sean de autenticación
        // Los errores de autenticación son esperados durante la transición de login
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

