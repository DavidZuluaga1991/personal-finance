import { apiClient } from '@/lib/api';
import { endpoints } from '@/lib/api';
import { Transaction, TransactionFormData } from '../types/transaction.types';

export const transactionService = {
  list: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<Transaction[]>(endpoints.transactions.list);
    console.log(response);
    return response.data;
  },

  get: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(endpoints.transactions.detail(id));
    return response.data;
  },

  create: async (payload: TransactionFormData): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>(
      endpoints.transactions.create,
      payload
    );
    return response.data;
  },

  update: async (id: string, payload: Partial<TransactionFormData>): Promise<Transaction> => {
    const response = await apiClient.put<Transaction>(
      endpoints.transactions.update(id),
      payload
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(endpoints.transactions.delete(id));
  },
};

