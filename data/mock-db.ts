import dbData from './db.json';

interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  avatar?: string;
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

const users: User[] = [...dbData.users];
const transactions: Transaction[] = [...dbData.transactions] as Transaction[];

export const mockDb = {
  users: {
    find: (predicate: (user: User) => boolean) => {
      return users.find(predicate);
    },
    getAll: () => users,
  },
  transactions: {
    getAll: () => transactions,
    getById: (id: string) => transactions.find((t) => t.id === id),
    add: (transaction: Transaction) => {
      transactions.push(transaction);
      return transaction;
    },
    update: (id: string, updates: Partial<Transaction>) => {
      const index = transactions.findIndex((t) => t.id === id);
      if (index === -1) return null;
      transactions[index] = { ...transactions[index], ...updates };
      return transactions[index];
    },
    delete: (id: string) => {
      const index = transactions.findIndex((t) => t.id === id);
      if (index === -1) return false;
      transactions.splice(index, 1);
      return true;
    },
  },
};

