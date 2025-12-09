import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authSlice';
import type { User } from '@/features/auth/types/auth.types';

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  it('should initialize with null user and token', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should login and set user and token', () => {
    const { result } = renderHook(() => useAuthStore());
    const user: User = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    };
    const token = 'test-token';

    act(() => {
      result.current.loginLocal(user, token);
    });

    expect(result.current.user).toEqual(user);
    expect(result.current.token).toBe(token);
  });

  it('should logout and clear user and token', () => {
    const { result } = renderHook(() => useAuthStore());
    const user: User = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    };
    const token = 'test-token';

    act(() => {
      result.current.loginLocal(user, token);
    });

    expect(result.current.user).toBeTruthy();

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should persist state to localStorage', () => {
    const { result } = renderHook(() => useAuthStore());
    const user: User = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    };
    const token = 'test-token';

    act(() => {
      result.current.loginLocal(user, token);
    });

    const stored = localStorage.getItem('auth-storage');
    expect(stored).toBeTruthy();
    
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.user).toEqual(user);
      expect(parsed.state.token).toBe(token);
    }
  });
});

