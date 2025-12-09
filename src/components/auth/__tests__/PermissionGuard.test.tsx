import { render, screen } from '@testing-library/react';
import { PermissionGuard } from '../PermissionGuard';
import { Permission } from '@/features/auth/types/auth.types';
import { usePermissions } from '@/hooks/usePermissions';

jest.mock('@/hooks/usePermissions');

describe('PermissionGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when user has permission', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      hasPermission: jest.fn(() => true),
    });

    render(
      <PermissionGuard permission={Permission.TRANSACTIONS_CREATE}>
        <div>Protected Content</div>
      </PermissionGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should not render children when user lacks permission', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      hasPermission: jest.fn(() => false),
    });

    render(
      <PermissionGuard permission={Permission.TRANSACTIONS_CREATE}>
        <div>Protected Content</div>
      </PermissionGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

