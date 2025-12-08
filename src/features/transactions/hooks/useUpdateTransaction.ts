'use client';

import { transactionService } from '../services/transactionService';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';
import type { TransactionFormData } from '../types/transaction.types';

export const useUpdateTransaction = () => {
  const update = useTransactionStore((s) => s.update);

  return async (id: string, data: Partial<TransactionFormData>) => {
    const updated = await transactionService.update(id, data);
    update(id, updated);
  };
};

