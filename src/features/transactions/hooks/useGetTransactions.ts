'use client';

import { useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';

export const useGetTransactions = () => {
  const setList = useTransactionStore((s) => s.setList);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await transactionService.list();
        if (mounted) setList(data);
      } catch (err) {
        console.error('Error fetching transactions', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setList]);
};

