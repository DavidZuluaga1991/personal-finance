import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionFilters } from '../TransactionFilters';
import type { TransactionType, SortField, SortOrder } from '../../types/transaction.types';

jest.mock('@/components/auth/PermissionGuard', () => ({
  PermissionGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockProps = {
  filterType: 'all' as TransactionType | 'all',
  sortField: 'date' as SortField,
  sortOrder: 'desc' as SortOrder,
  onFilterChange: jest.fn(),
  onSortFieldChange: jest.fn(),
  onSortOrderToggle: jest.fn(),
  onAddClick: jest.fn(),
  transactionCount: 10,
};

describe('TransactionFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render transaction count', () => {
    render(<TransactionFilters {...mockProps} />);
    
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('should call onFilterChange when filter type changes', () => {
    render(<TransactionFilters {...mockProps} />);
    
    const filterSelect = screen.getByDisplayValue('All Types');
    fireEvent.change(filterSelect, { target: { value: 'income' } });

    expect(mockProps.onFilterChange).toHaveBeenCalledWith('income');
  });

  it('should call onSortFieldChange when sort field changes', () => {
    render(<TransactionFilters {...mockProps} />);
    
    const sortSelect = screen.getByDisplayValue('Sort by Date');
    fireEvent.change(sortSelect, { target: { value: 'amount' } });

    expect(mockProps.onSortFieldChange).toHaveBeenCalledWith('amount');
  });

  it('should call onSortOrderToggle when sort order button is clicked', () => {
    render(<TransactionFilters {...mockProps} />);
    
    const sortOrderButton = screen.getByText('↓ Desc');
    fireEvent.click(sortOrderButton);

    expect(mockProps.onSortOrderToggle).toHaveBeenCalled();
  });

  it('should display Asc when sortOrder is asc', () => {
    render(<TransactionFilters {...mockProps} sortOrder="asc" />);
    
    expect(screen.getByText('↑ Asc')).toBeInTheDocument();
  });

  it('should call onAddClick when add button is clicked', () => {
    render(<TransactionFilters {...mockProps} />);
    
    const addButton = screen.getByText(/add transaction/i) || screen.getByText(/add/i);
    if (addButton) {
      fireEvent.click(addButton);
      expect(mockProps.onAddClick).toHaveBeenCalled();
    }
  });
});

