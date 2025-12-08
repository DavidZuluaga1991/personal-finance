'use client';

import { Filter, ArrowUpDown, Plus } from 'lucide-react';
import type { TransactionType, SortField, SortOrder } from '../types';

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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold text-white">Transactions</h3>
        <span className="text-sm text-slate-500">({transactionCount})</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value as TransactionType | 'all')}
            className="appearance-none px-4 py-2 rounded-lg border border-slate-800/80 bg-slate-900/60 text-slate-300 text-sm font-medium hover:border-blue-600 focus:border-blue-600 focus:outline-none transition-colors pl-9 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
          <Filter
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none"
          />
        </div>

        <div className="relative">
          <select
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="appearance-none px-4 py-2 rounded-lg border border-slate-800/80 bg-slate-900/60 text-slate-300 text-sm font-medium hover:border-blue-600 focus:border-blue-600 focus:outline-none transition-colors pl-9 cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
          <ArrowUpDown
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none"
          />
        </div>

        <button
          onClick={onSortOrderToggle}
          className="px-4 py-2 rounded-lg border border-slate-800/80 bg-slate-900/60 text-slate-300 text-sm font-medium hover:bg-slate-800/60 hover:border-blue-600 transition-colors flex items-center gap-2 justify-center"
        >
          {sortOrder === 'desc' ? '↓ Desc' : '↑ Asc'}
        </button>

        <button
          onClick={onAddClick}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center hover:shadow-md hover:shadow-blue-500/30"
        >
          <Plus size={16} />
          Add Transaction
        </button>
      </div>
    </div>
  );
}

