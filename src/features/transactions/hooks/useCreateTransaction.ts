'use client';

import { transactionService } from '../services/transactionService';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';
import type { TransactionFormData } from '../types';

export const useCreateTransaction = () => {
  const add = useTransactionStore((s) => s.add);

  return async (data: TransactionFormData) => {
    const created = await transactionService.create(data);
    add(created);
  };
};

