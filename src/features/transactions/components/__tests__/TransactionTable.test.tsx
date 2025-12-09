import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionTable } from '../TransactionTable';
import type { Transaction } from '../../types/transaction.types';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { canEditTransaction, canDeleteTransaction } from '@/lib/auth/permissions';

jest.mock('@/lib/store/slices/authSlice');
jest.mock('@/lib/auth/permissions');

describe('TransactionTable', () => {
  const mockTransactions: Transaction[] = [
    {
      id: 't1',
      userId: 1,
      title: 'Test Transaction 1',
      amount: 100,
      type: 'expense',
      category: 'food',
      date: '2024-01-15',
    },
    {
      id: 't2',
      userId: 1,
      title: 'Test Transaction 2',
      amount: 200,
      type: 'income',
      category: 'salary',
      date: '2024-01-16',
    },
  ];

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: 1, role: 'user' },
    });
    (canEditTransaction as jest.Mock).mockReturnValue(true);
    (canDeleteTransaction as jest.Mock).mockReturnValue(true);
  });

  it('should render empty state when no transactions', () => {
    render(
      <TransactionTable
        transactions={[]}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No transactions found')).toBeInTheDocument();
  });

  it('should render transactions in table', () => {
    render(
      <TransactionTable
        transactions={mockTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Transaction 1')).toBeInTheDocument();
    expect(screen.getByText('Test Transaction 2')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <TransactionTable
        transactions={mockTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByLabelText(/edit/i);
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith('t1');
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <TransactionTable
        transactions={mockTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByLabelText(/delete/i);
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith('t1');
  });

  it('should not show edit/delete buttons when user lacks permissions', () => {
    (canEditTransaction as jest.Mock).mockReturnValue(false);
    (canDeleteTransaction as jest.Mock).mockReturnValue(false);

    render(
      <TransactionTable
        transactions={mockTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.queryAllByLabelText(/edit/i);
    const deleteButtons = screen.queryAllByLabelText(/delete/i);

    expect(editButtons.length).toBe(0);
    expect(deleteButtons.length).toBe(0);
  });
});

