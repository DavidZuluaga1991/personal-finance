import { renderHook, act } from '@testing-library/react';
import { useUpdateTransaction } from '../useUpdateTransaction';
import { transactionService } from '../../services/transactionService';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';

jest.mock('../../services/transactionService');
jest.mock('@/lib/store/slices/transactionSlice');

describe('useUpdateTransaction', () => {
  const mockUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTransactionStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        update: mockUpdate,
      };
      return selector(state);
    });
  });

  it('should update transaction and update store', async () => {
    const updatedTransaction = {
      id: 't1',
      userId: 1,
      title: 'Updated Transaction',
      amount: 200,
      type: 'expense' as const,
      category: 'food' as const,
      date: '2024-01-15',
    };

    (transactionService.update as jest.Mock).mockResolvedValue(updatedTransaction);

    const { result } = renderHook(() => useUpdateTransaction());

    await act(async () => {
      await result.current('t1', {
        title: 'Updated Transaction',
        amount: 200,
      });
    });

    expect(transactionService.update).toHaveBeenCalledWith('t1', {
      title: 'Updated Transaction',
      amount: 200,
    });
    expect(mockUpdate).toHaveBeenCalledWith('t1', updatedTransaction);
  });

  it('should throw error on update failure', async () => {
    const error = new Error('Failed to update');
    (transactionService.update as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useUpdateTransaction());

    await expect(
      act(async () => {
        await result.current('t1', {
          title: 'Updated Transaction',
        });
      })
    ).rejects.toThrow('Failed to update');
  });
});

