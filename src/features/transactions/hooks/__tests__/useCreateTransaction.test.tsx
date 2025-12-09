import { renderHook, act } from '@testing-library/react';
import { useCreateTransaction } from '../useCreateTransaction';
import { transactionService } from '../../services/transactionService';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';

jest.mock('../../services/transactionService');
jest.mock('@/lib/store/slices/transactionSlice');

describe('useCreateTransaction', () => {
  const mockAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTransactionStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        add: mockAdd,
      };
      return selector(state);
    });
  });

  it('should create transaction and add to store', async () => {
    const newTransaction = {
      id: 't1',
      userId: 1,
      title: 'New Transaction',
      amount: 100,
      type: 'expense' as const,
      category: 'food' as const,
      date: '2024-01-15',
    };

    (transactionService.create as jest.Mock).mockResolvedValue(newTransaction);

    const { result } = renderHook(() => useCreateTransaction());

    await act(async () => {
      await result.current({
        title: 'New Transaction',
        amount: 100,
        type: 'expense',
        category: 'food',
        date: '2024-01-15',
      });
    });

    expect(transactionService.create).toHaveBeenCalled();
    expect(mockAdd).toHaveBeenCalledWith(newTransaction);
  });

  it('should throw error on creation failure', async () => {
    const error = new Error('Failed to create');
    (transactionService.create as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useCreateTransaction());

    await expect(
      act(async () => {
        await result.current({
          title: 'New Transaction',
          amount: 100,
          type: 'expense',
          category: 'food',
          date: '2024-01-15',
        });
      })
    ).rejects.toThrow('Failed to create');
  });
});

