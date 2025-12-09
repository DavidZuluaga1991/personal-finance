export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer',
  GUEST = 'guest',
}

export enum Permission {
  TRANSACTIONS_VIEW_OWN = 'transactions:view:own',
  TRANSACTIONS_VIEW_ALL = 'transactions:view:all',
  TRANSACTIONS_CREATE = 'transactions:create',
  TRANSACTIONS_EDIT_OWN = 'transactions:edit:own',
  TRANSACTIONS_EDIT_ALL = 'transactions:edit:all',
  TRANSACTIONS_DELETE_OWN = 'transactions:delete:own',
  TRANSACTIONS_DELETE_ALL = 'transactions:delete:all',
  SUMMARY_VIEW_OWN = 'summary:view:own',
  SUMMARY_VIEW_ALL = 'summary:view:all',
  USERS_VIEW = 'users:view',
  USERS_CREATE = 'users:create',
  USERS_EDIT = 'users:edit',
  USERS_DELETE = 'users:delete',
  SYSTEM_CONFIG = 'system:config',
}

export interface User {
  id: number;
  email: string;
  name?: string;
  role: UserRole;
  permissions?: Permission[];
  avatar?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
