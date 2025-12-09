import { renderHook } from '@testing-library/react';
import { usePermissions } from '../usePermissions';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { hasPermission, isAdmin } from '@/lib/auth/permissions';
import { Permission, UserRole } from '@/features/auth/types/auth.types';

jest.mock('@/lib/store/slices/authSlice');
jest.mock('@/lib/auth/permissions');

describe('usePermissions', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.USER,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const state = { user: mockUser };
      return selector(state);
    });
  });

  it('should check if user has specific permission', () => {
    (hasPermission as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(Permission.TRANSACTIONS_CREATE)).toBe(true);
    expect(hasPermission).toHaveBeenCalledWith(mockUser, Permission.TRANSACTIONS_CREATE);
  });

  it('should return false for permissions when user is null', () => {
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const state = { user: null };
      return selector(state);
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(Permission.TRANSACTIONS_CREATE)).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it('should return admin status correctly', () => {
    const adminUser = { ...mockUser, role: UserRole.ADMIN };
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const state = { user: adminUser };
      return selector(state);
    });
    (isAdmin as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => usePermissions());

    expect(result.current.isAdmin).toBe(true);
    expect(isAdmin).toHaveBeenCalledWith(adminUser);
  });
});

