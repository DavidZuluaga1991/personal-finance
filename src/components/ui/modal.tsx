'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-md mx-4 bg-slate-900/95 border border-slate-700/60 rounded-xl shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-slate-300 mb-6">{description}</p>
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-700/60 bg-slate-900/60 text-slate-300 hover:bg-slate-800/60"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className={
                variant === 'destructive'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

