import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction } from '@/features/transactions/types/transaction.types';

interface TransactionState {
  list: Transaction[];
  setList: (items: Transaction[]) => void;
  add: (item: Transaction) => void;
  update: (id: string, item: Partial<Transaction>) => void;
  remove: (id: string) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      list: [],
      setList: (items) => set({ list: items }),
      add: (item) =>
        set((state) => ({
          list: [...state.list, item],
        })),
      update: (id, newData) =>
        set((state) => ({
          list: state.list.map((t) =>
            t.id === id ? { ...t, ...newData } : t
          ),
        })),
      remove: (id) =>
        set((state) => ({
          list: state.list.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'transaction-storage',
    }
  )
);

