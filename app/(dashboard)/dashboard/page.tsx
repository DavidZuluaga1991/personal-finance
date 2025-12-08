'use client';

import { useState, useMemo } from 'react';
import { useGetTransactions } from '@/features/transactions/hooks/useGetTransactions';
import { useTransactionStore } from '@/lib/store/slices/transactionSlice';
import { useCreateTransaction } from '@/features/transactions/hooks/useCreateTransaction';
import { useDeleteTransaction } from '@/features/transactions/hooks/useDeleteTransaction';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import SummaryCard from '@/features/dashboard/components/SummaryCard';
import { TransactionFilters } from '@/features/transactions/components/TransactionFilters';
import { TransactionTable } from '@/features/transactions/components/TransactionTable';
import { AddTransactionForm } from '@/features/transactions/components/AddTransactionForm';
import { formatCurrency } from '@/lib/utils';
import type { TransactionType, SortField, SortOrder } from '@/features/transactions/types';

export default function DashboardPage() {
  useGetTransactions();
  const list = useTransactionStore((s) => s.list);
  const createTransaction = useCreateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const summary = useMemo(() => {
    const totalIncome = list
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = list
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : '0';

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      savingsRate,
    };
  }, [list]);

  const filteredTransactions = useMemo(() => {
    const filtered = filterType === 'all' ? list : list.filter((t) => t.type === filterType);

    return filtered.sort((a, b) => {
      let compareValue = 0;

      if (sortField === 'date') {
        compareValue = new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === 'amount') {
        compareValue = Math.abs(b.amount) - Math.abs(a.amount);
      }

      return sortOrder === 'desc' ? compareValue : -compareValue;
    });
  }, [list, filterType, sortField, sortOrder]);

  const handleCreate = async (data: Parameters<typeof createTransaction>[0]) => {
    setIsCreating(true);
    try {
      await createTransaction(data);
      setShowAddForm(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="min-h-screen dashboard-gradient flex">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        <Header title="Dashboard" />

        <main className="flex-1 px-6 py-8 overflow-auto">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-white mb-2">Dashboard</h3>
            <p className="text-slate-400">Manage your income and expenses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SummaryCard
              label="Total Income"
              value={formatCurrency(summary.totalIncome)}
              icon="income"
              subtitle={`+${summary.savingsRate}% savings rate`}
            />
            <SummaryCard
              label="Total Expenses"
              value={formatCurrency(summary.totalExpenses)}
              icon="expense"
              subtitle="Spent this month"
            />
            <SummaryCard
              label="Net Balance"
              value={formatCurrency(summary.netBalance)}
              icon="balance"
              subtitle={summary.netBalance >= 0 ? 'Surplus' : 'Deficit'}
              isHighlighted
              valueColor={summary.netBalance >= 0 ? 'green' : 'red'}
            />
          </div>

          <div className="card-glass rounded-xl p-6">
            <TransactionFilters
              filterType={filterType}
              sortField={sortField}
              sortOrder={sortOrder}
              onFilterChange={setFilterType}
              onSortFieldChange={setSortField}
              onSortOrderToggle={toggleSortOrder}
              onAddClick={() => setShowAddForm(!showAddForm)}
              transactionCount={filteredTransactions.length}
            />

            {showAddForm && (
              <AddTransactionForm
                onSubmit={handleCreate}
                onCancel={() => setShowAddForm(false)}
                isLoading={isCreating}
              />
            )}

            <TransactionTable
              transactions={filteredTransactions}
              onDelete={handleDelete}
            />

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-500">
              <p>
                Showing {filteredTransactions.length} of {list.length} transactions
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
