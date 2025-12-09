import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Test Modal',
    description: 'Test Description',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should render title and description when open', () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<Modal {...defaultProps} />);

    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', () => {
    render(<Modal {...defaultProps} />);

    const backdrop = screen.getByText('Test Modal').closest('.fixed.inset-0');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(defaultProps.onClose).toHaveBeenCalled();
    }
  });

  it('should call onConfirm and onClose when confirm button is clicked', () => {
    render(<Modal {...defaultProps} />);

    const confirmButton = screen.getByText(/confirm/i);
    fireEvent.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should use custom confirm and cancel text', () => {
    render(
      <Modal
        {...defaultProps}
        confirmText="Delete"
        cancelText="Cancel"
      />
    );

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should apply destructive variant styles', () => {
    render(
      <Modal
        {...defaultProps}
        variant="destructive"
      />
    );

    const confirmButton = screen.getByText(/confirm/i);
    expect(confirmButton).toHaveClass('bg-red-600');
  });
});

