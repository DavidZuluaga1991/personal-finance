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
  SALARY: 'salary',
  FREELANCE: 'freelance',
  INVESTMENT: 'investment',
  FOOD: 'food',
  TRANSPORT: 'transport',
  ENTERTAINMENT: 'entertainment',
  SUBSCRIPTIONS: 'subscriptions',
  SHOPPING: 'shopping',
  HEALTH: 'health',
  OTHER: 'other',
} as const;

export const CATEGORY_LABELS: Record<string, string> = {
  salary: 'Salary',
  freelance: 'Freelance',
  investment: 'Investment',
  food: 'Food',
  transport: 'Transport',
  entertainment: 'Entertainment',
  subscriptions: 'Subscriptions',
  shopping: 'Shopping',
  health: 'Health',
  other: 'Other',
};

