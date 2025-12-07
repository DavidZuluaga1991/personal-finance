import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
}

export function formatDateFull(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

