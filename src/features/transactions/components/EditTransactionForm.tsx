'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@/components/ui/error-message';
import { useToast } from '@/contexts/ToastContext';
import type { TransactionFormData, TransactionType, Transaction } from '../types/transaction.types';
import { TRANSACTION_CATEGORIES, CATEGORY_LABELS } from '@/lib/utils/constants';
import { transactionFormSchema } from '../schemas/transaction.schema';

interface EditTransactionFormProps {
  transaction: Transaction;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EditTransactionForm({
  transaction,
  onSubmit,
  onCancel,
  isLoading,
}: EditTransactionFormProps) {
  const { showError: showToastError } = useToast();
  const normalizeDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<TransactionFormData>({
    title: transaction.title,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    date: normalizeDate(transaction.date),
    description: transaction.description,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: normalizeDate(transaction.date),
      description: transaction.description,
    });
    setErrors({});
  }, [transaction]);

  const validateForm = (): boolean => {
    try {
      transactionFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        return false;
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction';
      showToastError('Failed to update transaction', errorMessage);
    }
  };

  const handleChange = (field: keyof TransactionFormData, value: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field in errors) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[field];
          return newErrors;
        });
      }
      return updated;
    });
  };

  return (
    <div className="mb-6 p-4 rounded-lg bg-slate-900/60 border border-slate-800/80">
      <h4 className="text-sm font-semibold text-white mb-4">Edit Transaction</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Transaction title"
              className="bg-slate-900/70 border-slate-800/80 text-white"
              required
            />
            {errors.title && <ErrorMessage message={errors.title} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="bg-slate-900/70 border-slate-800/80 text-white"
              required
            />
            {errors.amount && <ErrorMessage message={errors.amount} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-type">Type</Label>
            <select
              id="edit-type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value as TransactionType)}
              className="w-full px-3 py-2 rounded-lg border border-slate-800/80 bg-slate-900/70 text-slate-300 text-sm focus:border-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {errors.type && <ErrorMessage message={errors.type} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <select
              id="edit-category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-800/80 bg-slate-900/70 text-slate-300 text-sm focus:border-slate-600 focus:outline-none cursor-pointer"
            >
              {Object.values(TRANSACTION_CATEGORIES).map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category] || category}
                </option>
              ))}
            </select>
            {errors.category && <ErrorMessage message={errors.category} />}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="edit-date">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="bg-slate-900/70 border-slate-800/80 text-white"
              required
            />
            {errors.date && <ErrorMessage message={errors.date} />}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="edit-description">Description (Optional)</Label>
            <Input
              id="edit-description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Additional notes..."
              className="bg-slate-900/70 border-slate-800/80 text-white"
              maxLength={500}
            />
            {errors.description && <ErrorMessage message={errors.description} />}
            {formData.description && (
              <p className="text-xs text-slate-500">
                {formData.description.length}/500 characters
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Transaction'}
          </Button>
        </div>
      </form>
    </div>
  );
}

