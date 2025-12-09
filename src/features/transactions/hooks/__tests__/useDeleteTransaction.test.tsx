import { renderHook, act } from '@testing-library/react';
import { useDeleteTransaction } from '../useDeleteTransaction';
import { transactionService } from '../../services/transactionService';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';

jest.mock('../../services/transactionService');
jest.mock('@/lib/store/slices/transactionSlice');

describe('useDeleteTransaction', () => {
  const mockRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTransactionStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        remove: mockRemove,
      };
      return selector(state);
    });
  });

  it('should delete transaction and remove from store', async () => {
    (transactionService.delete as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteTransaction());

    await act(async () => {
      await result.current('t1');
    });

    expect(transactionService.delete).toHaveBeenCalledWith('t1');
    expect(mockRemove).toHaveBeenCalledWith('t1');
  });

  it('should throw error on deletion failure', async () => {
    const error = new Error('Failed to delete');
    (transactionService.delete as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useDeleteTransaction());

    await expect(
      act(async () => {
        await result.current('t1');
      })
    ).rejects.toThrow('Failed to delete');
  });
});

