import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '@/lib/utils/constants';

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];
export type TransactionCategory = typeof TRANSACTION_CATEGORIES[keyof typeof TRANSACTION_CATEGORIES];

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionFormData {
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  description?: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: TransactionCategory;
  startDate?: string;
  endDate?: string;
}

export type SortField = 'date' | 'amount' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface TransactionSort {
  field: SortField;
  order: SortOrder;
}

