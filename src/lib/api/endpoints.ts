const API_BASE = '/api';

export const endpoints = {
  auth: {
    login: `${API_BASE}/auth/login`,
  },
  transactions: {
    list: `${API_BASE}/transactions`,
    detail: (id: string) => `${API_BASE}/transactions/${id}`,
    create: `${API_BASE}/transactions`,
    update: (id: string) => `${API_BASE}/transactions/${id}`,
    delete: (id: string) => `${API_BASE}/transactions/${id}`,
  },
  summary: {
    get: `${API_BASE}/summary`,
  },
} as const;

