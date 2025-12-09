const getApiBase = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    return '';
  }
  return '/api';
};

const API_BASE = getApiBase();

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

