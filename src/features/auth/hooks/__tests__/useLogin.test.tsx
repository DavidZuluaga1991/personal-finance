import { renderHook, act, waitFor } from '@testing-library/react';
import { useLogin } from '../useLogin';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { authService } from '../../services/authService';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

jest.mock('@/lib/store/slices/authSlice');
jest.mock('../../services/authService');
jest.mock('next/navigation');
jest.mock('js-cookie');

describe('useLogin', () => {
  const mockLoginLocal = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as jest.Mock).mockReturnValue({
      loginLocal: mockLoginLocal,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (Cookies.set as jest.Mock).mockImplementation(() => {});
  });

  it('should login user and redirect to dashboard', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    };
    const mockToken = 'test-token';

    (authService.login as jest.Mock).mockResolvedValue({
      user: mockUser,
      token: mockToken,
    });

    const { result } = renderHook(() => useLogin());
    const login = result.current;

    await act(async () => {
      await login({ email: 'test@example.com', password: 'password123' });
    });

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockLoginLocal).toHaveBeenCalledWith(mockUser, mockToken);
    expect(Cookies.set).toHaveBeenCalledWith('token', mockToken, { expires: 1 });
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle login errors', async () => {
    const error = new Error('Invalid credentials');
    (authService.login as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useLogin());
    const login = result.current;

    await expect(
      act(async () => {
        await login({ email: 'test@example.com', password: 'wrong' });
      })
    ).rejects.toThrow('Invalid credentials');

    expect(mockLoginLocal).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});

