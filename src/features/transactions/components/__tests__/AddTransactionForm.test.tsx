import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddTransactionForm } from '../AddTransactionForm';
import { useToast } from '@/contexts/ToastContext';

jest.mock('@/contexts/ToastContext');

describe('AddTransactionForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const mockShowError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({
      showError: mockShowError,
    });
  });

  it('should render form fields', () => {
    render(
      <AddTransactionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  it('should call onSubmit with form data when submitted', async () => {
    render(
      <AddTransactionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Transaction' },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: 'expense' },
    });

    const submitButton = screen.getByText(/create transaction/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <AddTransactionForm
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
      <AddTransactionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByText(/creating/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeDisabled();
  });

  it('should validate required fields', async () => {
    render(
      <AddTransactionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByText(/create transaction/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});

