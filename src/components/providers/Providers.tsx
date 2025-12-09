'use client';

import { StyleSheetManager } from 'styled-components';
import { ToastProvider } from '../../contexts/ToastContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <StyleSheetManager>
    <ToastProvider>{children}</ToastProvider>
  </StyleSheetManager>;
}

