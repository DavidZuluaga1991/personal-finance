import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditTransactionForm } from '../EditTransactionForm';
import type { Transaction } from '../../types/transaction.types';
import { useToast } from '@/contexts/ToastContext';

jest.mock('@/contexts/ToastContext');

describe('EditTransactionForm', () => {
  const mockTransaction: Transaction = {
    id: 't1',
    userId: 1,
    title: 'Test Transaction',
    amount: 100,
    type: 'expense',
    category: 'food',
    date: '2024-01-15',
    description: 'Test description',
  };

  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const mockShowError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({
      showError: mockShowError,
    });
  });

  it('should render form with transaction data', () => {
    render(
      <EditTransactionForm
        transaction={mockTransaction}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByDisplayValue('Test Transaction')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
  });

  it('should call onSubmit with updated data', async () => {
    render(
      <EditTransactionForm
        transaction={mockTransaction}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Updated Title' },
    });

    const submitButton = screen.getByText(/update transaction/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Updated Title',
        })
      );
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <EditTransactionForm
        transaction={mockTransaction}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should show loading state when isLoading is true', () => {
    render(
      <EditTransactionForm
        transaction={mockTransaction}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByText(/updating/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeDisabled();
  });
});

