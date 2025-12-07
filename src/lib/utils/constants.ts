export const APP_NAME = 'Personal Finance Tracker';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const TRANSACTION_CATEGORIES = {
  FOOD: 'food',
  TRANSPORT: 'transport',
  ENTERTAINMENT: 'entertainment',
  BILLS: 'bills',
  SHOPPING: 'shopping',
  HEALTH: 'health',
  EDUCATION: 'education',
  SALARY: 'salary',
  OTHER: 'other',
} as const;

