import { formatCurrency, formatDate, formatDateFull } from '../formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-1000)).toBe('-$1,000.00');
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('should format large numbers correctly', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(999999999.99)).toBe('$999,999,999.99');
    });

    it('should format decimal numbers correctly', () => {
      expect(formatCurrency(0.01)).toBe('$0.01');
      expect(formatCurrency(0.99)).toBe('$0.99');
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
      expect(formatDate('2024-12-25')).toBe('Dec 25, 2024');
    });

    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T12:00:00');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan \d{2}, 2024/);
    });

    it('should handle ISO date strings', () => {
      expect(formatDate('2024-01-15T10:30:00Z')).toBe('Jan 15, 2024');
    });
  });

  describe('formatDateFull', () => {
    it('should format date with time correctly', () => {
      const formatted = formatDateFull('2024-01-15T10:30:00Z');
      expect(formatted).toContain('Jan 15, 2024');
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });

    it('should format Date object with time correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDateFull(date);
      expect(formatted).toContain('Jan 15, 2024');
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });
  });
});

