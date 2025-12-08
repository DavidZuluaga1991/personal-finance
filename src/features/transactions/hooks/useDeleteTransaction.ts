'use client';

import { transactionService } from '../services/transactionService';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';

export const useDeleteTransaction = () => {
  const remove = useTransactionStore((s) => s.remove);

  return async (id: string) => {
    await transactionService.delete(id);
    remove(id);
  };
};

