import { useAuthStore } from '@/lib/store/slices/authSlice';
import { Permission } from '@/features/auth/types/auth.types';
import { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin } from '@/lib/auth/permissions';

export function usePermissions() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return {
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      isAdmin: false,
      isUser: false,
      isViewer: false,
      isGuest: false,
    };
  }

  return {
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(user, permissions),
    isAdmin: isAdmin(user),
    isUser: user.role === 'user',
    isViewer: user.role === 'viewer',
    isGuest: user.role === 'guest',
  };
}

