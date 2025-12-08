'use client';

import { transactionService } from '../services/transactionService';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';
import { TransactionFormData } from '../types/transaction.types';

export const useCreateTransaction = () => {
  const add = useTransactionStore((s) => s.add);

  return async (data: TransactionFormData) => {
    const created = await transactionService.create(data);
    add(created);
  };
};

