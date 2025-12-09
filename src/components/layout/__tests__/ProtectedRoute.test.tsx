import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/store/slices/authSlice');
jest.mock('next/navigation');

describe('ProtectedRoute', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render children when user is authenticated', () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      token: 'test-token',
      hasHydrated: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      token: null,
      hasHydrated: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should show loading spinner while hydrating', () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      token: null,
      hasHydrated: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

