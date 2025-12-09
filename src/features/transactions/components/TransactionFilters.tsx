'use client';

import { Filter, ArrowUpDown, Plus } from 'lucide-react';
import type { TransactionType, SortField, SortOrder } from '../types/transaction.types';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Permission } from '@/features/auth/types/auth.types';

interface TransactionFiltersProps {
  filterType: TransactionType | 'all';
  sortField: SortField;
  sortOrder: SortOrder;
  onFilterChange: (type: TransactionType | 'all') => void;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderToggle: () => void;
  onAddClick: () => void;
  transactionCount: number;
}

export function TransactionFilters({
  filterType,
  sortField,
  sortOrder,
  onFilterChange,
  onSortFieldChange,
  onSortOrderToggle,
  onAddClick,
  transactionCount,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <h3 className="text-base sm:text-lg font-bold text-white">Transactions</h3>
        <span className="text-xs sm:text-sm text-slate-500">({transactionCount})</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1 sm:flex-none">
          <div className="relative flex-1 sm:flex-none sm:w-auto min-w-[140px]">
            <select
              value={filterType}
              onChange={(e) => onFilterChange(e.target.value as TransactionType | 'all')}
              className="w-full appearance-none px-3 sm:px-4 py-2 rounded-lg border border-slate-800/80 bg-slate-900/60 text-slate-300 text-xs sm:text-sm font-medium hover:border-blue-600 focus:border-blue-600 focus:outline-none transition-colors pl-8 sm:pl-9 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
            <Filter
              size={14}
              className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>

          <div className="flex gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none sm:w-auto min-w-[140px]">
              <select
                value={sortField}
                onChange={(e) => onSortFieldChange(e.target.value as SortField)}
                className="w-full appearance-none px-3 sm:px-4 py-2 rounded-lg border border-slate-800/80 bg-slate-900/60 text-slate-300 text-xs sm:text-sm font-medium hover:border-blue-600 focus:border-blue-600 focus:outline-none transition-colors pl-8 sm:pl-9 cursor-pointer"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="title">Sort by Title</option>
              </select>
              <ArrowUpDown
                size={14}
                className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none"
              />
            </div>

            <button
              onClick={onSortOrderToggle}
              className="px-3 sm:px-4 py-2 rounded-lg border border-slate-800/80 bg-slate-900/60 text-slate-300 text-xs sm:text-sm font-medium hover:bg-slate-800/60 hover:border-blue-600 transition-colors flex items-center gap-2 justify-center cursor-pointer whitespace-nowrap min-w-[80px]"
            >
              {sortOrder === 'desc' ? '↓ Desc' : '↑ Asc'}
            </button>
          </div>
        </div>

        <PermissionGuard permission={Permission.TRANSACTIONS_CREATE}>
          <button
            onClick={onAddClick}
            className="px-3 sm:px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center hover:shadow-md hover:shadow-blue-500/30 cursor-pointer whitespace-nowrap"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        </PermissionGuard>
      </div>
    </div>
  );
}

