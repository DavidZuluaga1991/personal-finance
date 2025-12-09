import { transactionService } from '../transactionService';
import { apiClient } from '@/lib/api';
import { endpoints } from '@/lib/api';
import type { Transaction } from '../../types/transaction.types';

jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  endpoints: {
    transactions: {
      list: '/transactions',
      detail: (id: string) => `/transactions/${id}`,
      create: '/transactions',
      update: (id: string) => `/transactions/${id}`,
      delete: (id: string) => `/transactions/${id}`,
    },
  },
}));

describe('transactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTransaction: Transaction = {
    id: 't1',
    userId: 1,
    title: 'Test Transaction',
    amount: 100,
    type: 'expense',
    category: 'food',
    date: '2024-01-15',
  };

  describe('list', () => {
    it('should fetch all transactions', async () => {
      const mockResponse = {
        data: [mockTransaction],
        message: 'Transactions retrieved successfully',
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await transactionService.list();

      expect(apiClient.get).toHaveBeenCalledWith(endpoints.transactions.list);
      expect(result).toEqual([mockTransaction]);
    });

    it('should handle empty list', async () => {
      const mockResponse = {
        data: [],
        message: 'Transactions retrieved successfully',
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await transactionService.list();

      expect(result).toEqual([]);
    });
  });

  describe('get', () => {
    it('should fetch single transaction by id', async () => {
      const mockResponse = {
        data: mockTransaction,
        message: 'Transaction retrieved successfully',
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await transactionService.get('t1');

      expect(apiClient.get).toHaveBeenCalledWith('/transactions/t1');
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('create', () => {
    it('should create new transaction', async () => {
      const newTransaction = {
        title: 'New Transaction',
        amount: 200,
        type: 'income' as const,
        category: 'salary' as const,
        date: '2024-01-16',
      };

      const mockResponse = {
        data: { ...mockTransaction, ...newTransaction, id: 't2' },
        message: 'Transaction created successfully',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await transactionService.create(newTransaction);

      expect(apiClient.post).toHaveBeenCalledWith(
        endpoints.transactions.create,
        newTransaction
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('update', () => {
    it('should update existing transaction', async () => {
      const updates = { title: 'Updated Title', amount: 150 };
      const updatedTransaction = { ...mockTransaction, ...updates };

      const mockResponse = {
        data: updatedTransaction,
        message: 'Transaction updated successfully',
      };

      (apiClient.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await transactionService.update('t1', updates);

      expect(apiClient.put).toHaveBeenCalledWith(
        '/transactions/t1',
        updates
      );
      expect(result).toEqual(updatedTransaction);
    });
  });

  describe('delete', () => {
    it('should delete transaction', async () => {
      const mockResponse = {
        message: 'Transaction deleted successfully',
      };

      (apiClient.delete as jest.Mock).mockResolvedValue(mockResponse);

      await transactionService.delete('t1');

      expect(apiClient.delete).toHaveBeenCalledWith('/transactions/t1');
    });
  });
});

