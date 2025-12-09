import { UserRole, Permission, type User } from '@/features/auth/types/auth.types';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.TRANSACTIONS_VIEW_ALL,
    Permission.TRANSACTIONS_CREATE,
    Permission.TRANSACTIONS_EDIT_ALL,
    Permission.TRANSACTIONS_DELETE_ALL,
    Permission.SUMMARY_VIEW_ALL,
    Permission.USERS_VIEW,
    Permission.USERS_CREATE,
    Permission.USERS_EDIT,
    Permission.USERS_DELETE,
    Permission.SYSTEM_CONFIG,
  ],
  [UserRole.USER]: [
    Permission.TRANSACTIONS_VIEW_OWN,
    Permission.TRANSACTIONS_CREATE,
    Permission.TRANSACTIONS_EDIT_OWN,
    Permission.TRANSACTIONS_DELETE_OWN,
    Permission.SUMMARY_VIEW_OWN,
  ],
  [UserRole.VIEWER]: [
    Permission.TRANSACTIONS_VIEW_OWN,
    Permission.SUMMARY_VIEW_OWN,
  ],
  [UserRole.GUEST]: [],
};

export function getUserPermissions(user: User): Permission[] {
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  const customPermissions = user.permissions || [];
  
  return [...new Set([...rolePermissions, ...customPermissions])];
}

export function hasPermission(user: User, permission: Permission): boolean {
  const permissions = getUserPermissions(user);
  return permissions.includes(permission);
}

export function hasAnyPermission(user: User, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(user, permission));
}

export function hasAllPermissions(user: User, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(user, permission));
}

export function isAdmin(user: User): boolean {
  return user.role === UserRole.ADMIN;
}

export function canEditTransaction(user: User, transactionUserId?: number): boolean {
  if (isAdmin(user)) return true;
  if (hasPermission(user, Permission.TRANSACTIONS_EDIT_ALL)) return true;
  if (hasPermission(user, Permission.TRANSACTIONS_EDIT_OWN) && transactionUserId === user.id) return true;
  return false;
}

export function canDeleteTransaction(user: User, transactionUserId?: number): boolean {
  if (isAdmin(user)) return true;
  if (hasPermission(user, Permission.TRANSACTIONS_DELETE_ALL)) return true;
  if (hasPermission(user, Permission.TRANSACTIONS_DELETE_OWN) && transactionUserId === user.id) return true;
  return false;
}

export function canViewTransaction(user: User, transactionUserId?: number): boolean {
  if (isAdmin(user)) return true;
  if (hasPermission(user, Permission.TRANSACTIONS_VIEW_ALL)) return true;
  if (hasPermission(user, Permission.TRANSACTIONS_VIEW_OWN) && transactionUserId === user.id) return true;
  return false;
}

