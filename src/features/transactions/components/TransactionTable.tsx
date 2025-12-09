'use client';

import { Edit2, Trash2 } from 'lucide-react';
import type { Transaction } from '../types/transaction.types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_LABELS } from '@/lib/utils/constants';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Permission } from '@/features/auth/types/auth.types';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { canEditTransaction, canDeleteTransaction } from '@/lib/auth/permissions';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit?: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  const user = useAuthStore((state) => state.user);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-sm">No transactions found</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/80">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="transaction-row-hover border-b border-slate-800/80 group"
              >
                <td className="px-4 py-4 text-sm font-medium text-white">{transaction.title}</td>
                <td className="px-4 py-4 text-sm text-slate-400">
                  {CATEGORY_LABELS[transaction.category] || transaction.category}
                </td>
                <td className="px-4 py-4 text-sm">
                  <Badge variant={transaction.type === 'income' ? 'income' : 'expense'}>
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </Badge>
                </td>
                <td
                  className={`px-4 py-4 text-sm font-bold text-right ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </td>
                <td className="px-4 py-4 text-sm text-slate-400">{formatDate(transaction.date)}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && user && canEditTransaction(user, transaction.userId) && (
                      <button
                        onClick={() => onEdit(transaction.id)}
                        className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {user && canDeleteTransaction(user, transaction.userId) && (
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-slate-800/40 border border-slate-800/80 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{transaction.title}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {CATEGORY_LABELS[transaction.category] || transaction.category}
                </p>
              </div>
              <Badge variant={transaction.type === 'income' ? 'income' : 'expense'} className="ml-2 flex-shrink-0">
                {transaction.type === 'income' ? 'Income' : 'Expense'}
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div>
                <p
                  className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </p>
                <p className="text-xs text-slate-400 mt-1">{formatDate(transaction.date)}</p>
              </div>
              <div className="flex items-center gap-2">
                {onEdit && user && canEditTransaction(user, transaction.userId) && (
                  <button
                    onClick={() => onEdit(transaction.id)}
                    className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-blue-500 hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                )}
                {user && canDeleteTransaction(user, transaction.userId) && (
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-red-500 hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

