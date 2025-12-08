'use client';

import { useMemo } from 'react';
import { useGetTransactions } from '@/features/transactions/hooks/useGetTransactions';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';
import SummaryCard from '@/features/dashboard/components/SummaryCard';
import TransactionTable from '@/features/dashboard/components/TransactionTable';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  useGetTransactions();
  const list = useTransactionStore((s) => s.list);

  const { income, expense, balance } = useMemo(() => {
    const income = list
      .filter((l) => l.type === 'income')
      .reduce((a, b) => a + Number(b.amount), 0);

    const expense = list
      .filter((l) => l.type === 'expense')
      .reduce((a, b) => a + Number(b.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [list]);

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          label="Income"
          value={formatCurrency(income)}
          color="#10b981"
        />
        <SummaryCard
          label="Expense"
          value={formatCurrency(expense)}
          color="#ef4444"
        />
        <SummaryCard
          label="Balance"
          value={formatCurrency(balance)}
          color="#3b82f6"
        />
      </div>

      <TransactionTable data={list} />
    </div>
  );
}

