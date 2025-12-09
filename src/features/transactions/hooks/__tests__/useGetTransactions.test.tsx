import { renderHook, waitFor } from '@testing-library/react';
import { useGetTransactions } from '../useGetTransactions';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { transactionService } from '../../services/transactionService';

jest.mock('@/lib/store/slices/transactionSlice');
jest.mock('@/lib/store/slices/authSlice');
jest.mock('../../services/transactionService');

describe('useGetTransactions', () => {
  const mockSetList = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTransactionStore as jest.Mock).mockReturnValue({
      setList: mockSetList,
    });
    (useAuthStore as jest.Mock).mockReturnValue({
      token: 'test-token',
      hasHydrated: true,
      user: { id: 1, email: 'test@example.com' },
    });
  });

  it('should fetch and set transactions when hydrated', async () => {
    const mockTransactions = [
      {
        id: 't1',
        userId: 1,
        title: 'Test Transaction',
        amount: 100,
        type: 'expense',
        category: 'food',
        date: '2024-01-15',
      },
    ];

    (transactionService.list as jest.Mock).mockResolvedValue(mockTransactions);

    renderHook(() => useGetTransactions());

    await waitFor(() => {
      expect(transactionService.list).toHaveBeenCalled();
      expect(mockSetList).toHaveBeenCalledWith(mockTransactions);
    });
  });

  it('should not fetch if not hydrated', () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      token: 'test-token',
      hasHydrated: false,
      user: { id: 1, email: 'test@example.com' },
    });

    renderHook(() => useGetTransactions());

    expect(transactionService.list).not.toHaveBeenCalled();
  });

  it('should not fetch if no token', () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      token: null,
      hasHydrated: true,
      user: null,
    });

    renderHook(() => useGetTransactions());

    expect(transactionService.list).not.toHaveBeenCalled();
  });

  it('should handle fetch errors gracefully', async () => {
    const error = new Error('Network error');
    (transactionService.list as jest.Mock).mockRejectedValue(error);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    renderHook(() => useGetTransactions());

    await waitFor(() => {
      expect(transactionService.list).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});

