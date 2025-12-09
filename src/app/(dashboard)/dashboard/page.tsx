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
import { EditTransactionForm } from '@/features/transactions/components/EditTransactionForm';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/contexts/ToastContext';
import { useUpdateTransaction } from '@/features/transactions/hooks/useUpdateTransaction';
import { formatCurrency } from '@/lib/utils';
import { SortField, SortOrder, TransactionType } from '@/features/transactions/types/transaction.types';
// import type { TransactionType, SortField, SortOrder } from '@/features/transactions/types';

export default function DashboardPage() {
  useGetTransactions();
  const list = useTransactionStore((s) => s.list);
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });
  const { showSuccess, showError } = useToast();

  const summary = useMemo(() => {
    const totalIncome = list
      ?.filter((t) => t.type === 'income')
      ?.reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = list
      ?.filter((t) => t.type === 'expense')
      ?.reduce((sum, t) => sum + Number(t.amount), 0);

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
    const filtered = filterType === 'all' ? list : list?.filter((t) => t.type === filterType);

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
      showSuccess('Transaction created', 'The transaction has been added successfully.');
    } catch (error) {
      showError('Failed to create transaction', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowAddForm(false);
  };

  const handleUpdate = async (data: Parameters<typeof updateTransaction>[1]) => {
    if (!editingId) return;

    setIsUpdating(true);
    try {
      await updateTransaction(editingId, data);
      setEditingId(null);
      showSuccess('Transaction updated', 'The transaction has been updated successfully.');
    } catch (error) {
      showError('Failed to update transaction', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.id) {
      try {
        await deleteTransaction(deleteModal.id);
        showSuccess('Transaction deleted', 'The transaction has been removed successfully.');
      } catch (error) {
        showError('Failed to delete transaction', error instanceof Error ? error.message : 'An error occurred');
      }
    }
    setDeleteModal({ isOpen: false, id: null });
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen dashboard-gradient flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-auto">
          <div className="mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h3>
            <p className="text-sm sm:text-base text-slate-400">Manage your income and expenses</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

          <div className="card-glass rounded-xl p-4 sm:p-6">
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

            {showAddForm && !editingId && (
              <AddTransactionForm
                onSubmit={handleCreate}
                onCancel={() => setShowAddForm(false)}
                isLoading={isCreating}
              />
            )}

            {editingId && (
              <EditTransactionForm
                transaction={list.find((t) => t.id === editingId)!}
                onSubmit={handleUpdate}
                onCancel={() => setEditingId(null)}
                isLoading={isUpdating}
              />
            )}

            <TransactionTable
              transactions={filteredTransactions}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />

            <Modal
              isOpen={deleteModal.isOpen}
              onClose={() => setDeleteModal({ isOpen: false, id: null })}
              onConfirm={handleDeleteConfirm}
              title="Delete Transaction"
              description="Are you sure you want to delete this transaction? This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              variant="destructive"
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
