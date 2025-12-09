import {
  getUserPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  canEditTransaction,
  canDeleteTransaction,
  canViewTransaction,
} from '../permissions';
import { UserRole, Permission } from '@/features/auth/types/auth.types';
import type { User } from '@/features/auth/types/auth.types';

describe('permissions', () => {
  const createUser = (role: UserRole, permissions: Permission[] = []): User => ({
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role,
    permissions,
  });

  describe('getUserPermissions', () => {
    it('should return role permissions for admin', () => {
      const user = createUser(UserRole.ADMIN);
      const permissions = getUserPermissions(user);
      
      expect(permissions).toContain(Permission.TRANSACTIONS_VIEW_ALL);
      expect(permissions).toContain(Permission.TRANSACTIONS_CREATE);
      expect(permissions).toContain(Permission.SUMMARY_VIEW_ALL);
    });

    it('should return role permissions for user', () => {
      const user = createUser(UserRole.USER);
      const permissions = getUserPermissions(user);
      
      expect(permissions).toContain(Permission.TRANSACTIONS_VIEW_OWN);
      expect(permissions).toContain(Permission.TRANSACTIONS_CREATE);
      expect(permissions).toContain(Permission.TRANSACTIONS_EDIT_OWN);
    });

    it('should merge role permissions with custom permissions', () => {
      const customPerms = [Permission.TRANSACTIONS_EDIT_ALL];
      const user = createUser(UserRole.USER, customPerms);
      const permissions = getUserPermissions(user);
      
      expect(permissions).toContain(Permission.TRANSACTIONS_VIEW_OWN);
      expect(permissions).toContain(Permission.TRANSACTIONS_EDIT_ALL);
    });

    it('should return empty array for guest', () => {
      const user = createUser(UserRole.GUEST);
      const permissions = getUserPermissions(user);
      
      expect(permissions).toEqual([]);
    });
  });

  describe('hasPermission', () => {
    it('should return true if user has the permission', () => {
      const user = createUser(UserRole.USER);
      expect(hasPermission(user, Permission.TRANSACTIONS_CREATE)).toBe(true);
    });

    it('should return false if user does not have the permission', () => {
      const user = createUser(UserRole.VIEWER);
      expect(hasPermission(user, Permission.TRANSACTIONS_CREATE)).toBe(false);
    });

    it('should return true for custom permissions', () => {
      const user = createUser(UserRole.USER, [Permission.TRANSACTIONS_EDIT_ALL]);
      expect(hasPermission(user, Permission.TRANSACTIONS_EDIT_ALL)).toBe(true);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true if user has at least one permission', () => {
      const user = createUser(UserRole.USER);
      const perms = [Permission.TRANSACTIONS_CREATE, Permission.USERS_VIEW];
      
      expect(hasAnyPermission(user, perms)).toBe(true);
    });

    it('should return false if user has none of the permissions', () => {
      const user = createUser(UserRole.VIEWER);
      const perms = [Permission.TRANSACTIONS_CREATE, Permission.USERS_VIEW];
      
      expect(hasAnyPermission(user, perms)).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true if user has all permissions', () => {
      const user = createUser(UserRole.USER);
      const perms = [Permission.TRANSACTIONS_VIEW_OWN, Permission.TRANSACTIONS_CREATE];
      
      expect(hasAllPermissions(user, perms)).toBe(true);
    });

    it('should return false if user is missing any permission', () => {
      const user = createUser(UserRole.VIEWER);
      const perms = [Permission.TRANSACTIONS_VIEW_OWN, Permission.TRANSACTIONS_CREATE];
      
      expect(hasAllPermissions(user, perms)).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin users', () => {
      const user = createUser(UserRole.ADMIN);
      expect(isAdmin(user)).toBe(true);
    });

    it('should return false for non-admin users', () => {
      expect(isAdmin(createUser(UserRole.USER))).toBe(false);
      expect(isAdmin(createUser(UserRole.VIEWER))).toBe(false);
      expect(isAdmin(createUser(UserRole.GUEST))).toBe(false);
    });
  });

  describe('canEditTransaction', () => {
    it('should return true for admin users', () => {
      const user = createUser(UserRole.ADMIN);
      expect(canEditTransaction(user, 999)).toBe(true);
    });

    it('should return true if user owns the transaction', () => {
      const user = createUser(UserRole.USER);
      expect(canEditTransaction(user, user.id)).toBe(true);
    });

    it('should return false if user does not own the transaction', () => {
      const user = createUser(UserRole.USER);
      expect(canEditTransaction(user, 999)).toBe(false);
    });

    it('should return true for users with EDIT_ALL permission', () => {
      const user = createUser(UserRole.USER, [Permission.TRANSACTIONS_EDIT_ALL]);
      expect(canEditTransaction(user, 999)).toBe(true);
    });
  });

  describe('canDeleteTransaction', () => {
    it('should return true for admin users', () => {
      const user = createUser(UserRole.ADMIN);
      expect(canDeleteTransaction(user, 999)).toBe(true);
    });

    it('should return true if user owns the transaction', () => {
      const user = createUser(UserRole.USER);
      expect(canDeleteTransaction(user, user.id)).toBe(true);
    });

    it('should return false if user does not own the transaction', () => {
      const user = createUser(UserRole.USER);
      expect(canDeleteTransaction(user, 999)).toBe(false);
    });

    it('should return true for users with DELETE_ALL permission', () => {
      const user = createUser(UserRole.USER, [Permission.TRANSACTIONS_DELETE_ALL]);
      expect(canDeleteTransaction(user, 999)).toBe(true);
    });
  });

  describe('canViewTransaction', () => {
    it('should return true for admin users', () => {
      const user = createUser(UserRole.ADMIN);
      expect(canViewTransaction(user, 999)).toBe(true);
    });

    it('should return true if user owns the transaction', () => {
      const user = createUser(UserRole.USER);
      expect(canViewTransaction(user, user.id)).toBe(true);
    });

    it('should return false if user does not own the transaction', () => {
      const user = createUser(UserRole.USER);
      expect(canViewTransaction(user, 999)).toBe(false);
    });

    it('should return true for users with VIEW_ALL permission', () => {
      const user = createUser(UserRole.USER, [Permission.TRANSACTIONS_VIEW_ALL]);
      expect(canViewTransaction(user, 999)).toBe(true);
    });
  });
});

