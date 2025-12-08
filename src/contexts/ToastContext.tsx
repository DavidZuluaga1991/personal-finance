'use client';

import * as React from 'react';
import { ToastContainer, type Toast } from '../components/ui/toast';

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
  showInfo: (title: string, description?: string) => void;
  showWarning: (title: string, description?: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = React.useCallback(
    (title: string, description?: string) => {
      showToast({ type: 'success', title, description });
    },
    [showToast]
  );

  const showError = React.useCallback(
    (title: string, description?: string) => {
      showToast({ type: 'error', title, description });
    },
    [showToast]
  );

  const showInfo = React.useCallback(
    (title: string, description?: string) => {
      showToast({ type: 'info', title, description });
    },
    [showToast]
  );

  const showWarning = React.useCallback(
    (title: string, description?: string) => {
      showToast({ type: 'warning', title, description });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, showSuccess, showError, showInfo, showWarning }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

