import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

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

interface Database {
  users: User[];
  transactions: Transaction[];
}

async function readDb(): Promise<Database> {
  try {
    const fileContent = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return { users: [], transactions: [] };
  }
}

async function writeDb(data: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  users: {
    find: async (predicate: (user: User) => boolean): Promise<User | undefined> => {
      const database = await readDb();
      return database.users.find(predicate);
    },
    getAll: async (): Promise<User[]> => {
      const database = await readDb();
      return database.users;
    },
  },
  transactions: {
    getAll: async (): Promise<Transaction[]> => {
      const database = await readDb();
      return database.transactions;
    },
    getById: async (id: string): Promise<Transaction | undefined> => {
      const database = await readDb();
      return database.transactions.find((t) => t.id === id);
    },
    add: async (transaction: Transaction): Promise<Transaction> => {
      const database = await readDb();
      database.transactions.push(transaction);
      await writeDb(database);
      return transaction;
    },
    update: async (id: string, updates: Partial<Transaction>): Promise<Transaction | null> => {
      const database = await readDb();
      const index = database.transactions.findIndex((t) => t.id === id);
      if (index === -1) return null;
      database.transactions[index] = { ...database.transactions[index], ...updates };
      await writeDb(database);
      return database.transactions[index];
    },
    delete: async (id: string): Promise<boolean> => {
      const database = await readDb();
      const index = database.transactions.findIndex((t) => t.id === id);
      if (index === -1) return false;
      database.transactions.splice(index, 1);
      await writeDb(database);
      return true;
    },
  },
};

