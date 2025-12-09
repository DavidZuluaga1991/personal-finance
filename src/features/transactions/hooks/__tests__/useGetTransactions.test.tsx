import { renderHook, act } from '@testing-library/react';
import { useGetTransactions } from '../useGetTransactions';
import { transactionService } from '../../services/transactionService';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';
import { useAuthStore } from '@/lib/store/slices/authSlice';

// Mock del service
jest.mock('../../services/transactionService', () => ({
  transactionService: {
    list: jest.fn(),
  },
}));

// Mock stores de Zustand
jest.mock('@/lib/store/slices/transactionSlice', () => ({
  useTransactionStore: jest.fn(),
}));

jest.mock('@/lib/store/slices/authSlice', () => ({
  useAuthStore: jest.fn(),
}));

describe('useGetTransactions', () => {
  let setListMock: jest.Mock;

  beforeEach(() => {
    setListMock = jest.fn();

    (useTransactionStore as unknown as jest.Mock).mockReturnValue(setListMock);

    jest.clearAllMocks();
  });

  const mockAuthState = ({
    token = null,
    hasHydrated = true,
    user = null
  } = {}) => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        token,
        _hasHydrated: hasHydrated,
        user,
      })
    );
  };

  it('should NOT fetch if no token', () => {
    mockAuthState({ token: null, user: { id: 1 } });

    renderHook(() => useGetTransactions());

    expect(transactionService.list).not.toHaveBeenCalled();
  });

  it('should NOT fetch if no user', () => {
    mockAuthState({ token: 'abc123', user: null });

    renderHook(() => useGetTransactions());

    expect(transactionService.list).not.toHaveBeenCalled();
  });

  it('should NOT fetch if not hydrated', () => {
    mockAuthState({ hasHydrated: false, token: 'abc', user: { id: 1 } });

    renderHook(() => useGetTransactions());

    expect(transactionService.list).not.toHaveBeenCalled();
  });

  it('should fetch when hydrated + token + user', async () => {
    mockAuthState({ token: 'abc', user: { id: 1 }, hasHydrated: true });
    const fakeData = [{ id: 1 }];

    (transactionService.list as jest.Mock).mockResolvedValue(fakeData);

    await act(async () => {
      renderHook(() => useGetTransactions());
    });

    expect(transactionService.list).toHaveBeenCalledTimes(1);
    expect(setListMock).toHaveBeenCalledWith(fakeData);
  });

  it('should handle non-auth errors gracefully', async () => {
    mockAuthState({ token: 'abc', user: { id: 1 } });

    const error = new Error('Something failed');

    (transactionService.list as jest.Mock).mockRejectedValue(error);

    await act(async () => {
      renderHook(() => useGetTransactions());
    });

    // Nunca debe romper
    expect(transactionService.list).toHaveBeenCalled();
  });

  it('should redirect on 401 auth error', async () => {
    mockAuthState({ token: 'abc', user: { id: 1 } });

    delete (window as any).location;
    (window as any).location = { href: '' };

    (transactionService.list as jest.Mock).mockRejectedValue({ status: 401 });

    await act(async () => {
      renderHook(() => useGetTransactions());
    });

    expect(window.location.href).toBe('/login');
  });

  it('should NOT call list() multiple times due to ref', async () => {
    mockAuthState({ token: 'abc', user: { id: 1 }, hasHydrated: true });

    const fakeData = [{ id: 1 }];
    (transactionService.list as jest.Mock).mockResolvedValue(fakeData);

    const { rerender } = renderHook(() => useGetTransactions());

    await act(async () => {
      rerender();
    });

    expect(transactionService.list).toHaveBeenCalledTimes(1);
  });
});
