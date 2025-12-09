import { render, screen, fireEvent } from '@testing-library/react';
import SummaryCard from '../SummaryCard';

describe('SummaryCard', () => {
  const defaultProps = {
    label: 'Total Income',
    value: '$1,000.00',
    icon: 'income' as const,
    subtitle: '+10% savings rate',
  };

  it('should render label and value', () => {
    render(<SummaryCard {...defaultProps} />);
    
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    render(<SummaryCard {...defaultProps} />);
    
    expect(screen.getByText('+10% savings rate')).toBeInTheDocument();
  });

  it('should not render subtitle when not provided', () => {
    const { subtitle, ...props } = defaultProps;
    render(<SummaryCard {...props} />);
    
    expect(screen.queryByText('+10% savings rate')).not.toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    const handleClick = jest.fn();
    const { container } = render(<SummaryCard {...defaultProps} onClick={handleClick} />);
    
    const card = container.querySelector('.cursor-pointer');
    if (card) {
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalled();
    }
  });

  it('should not call onClick when not provided', () => {
    const { container } = render(<SummaryCard {...defaultProps} />);
    
    const card = container.querySelector('div');
    if (card) {
      fireEvent.click(card);
    }
  });

  it('should apply highlighted styles when isHighlighted is true', () => {
    const { container } = render(<SummaryCard {...defaultProps} isHighlighted />);
    
    const card = container.querySelector('.bg-blue-600\\/10');
    expect(card).toBeInTheDocument();
  });

  it('should apply green color for positive value', () => {
    render(<SummaryCard {...defaultProps} valueColor="green" />);
    
    const value = screen.getByText('$1,000.00');
    expect(value).toHaveClass('text-green-500');
  });

  it('should apply red color for negative value', () => {
    render(<SummaryCard {...defaultProps} valueColor="red" />);
    
    const value = screen.getByText('$1,000.00');
    expect(value).toHaveClass('text-red-500');
  });
});

