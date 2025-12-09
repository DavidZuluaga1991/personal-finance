import { transactionFormSchema } from '../transaction.schema';
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '@/lib/utils/constants';

describe('transactionFormSchema', () => {
  const validTransaction = {
    title: 'Test Transaction',
    amount: 100.50,
    type: TRANSACTION_TYPES.EXPENSE,
    category: TRANSACTION_CATEGORIES.FOOD,
    date: '2024-01-15',
    description: 'Optional description',
  };

  describe('title validation', () => {
    it('should accept valid title', () => {
      const result = transactionFormSchema.safeParse(validTransaction);
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        title: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject title shorter than 3 characters', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        title: 'AB',
      });
      expect(result.success).toBe(false);
    });

    it('should reject title longer than 100 characters', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        title: 'A'.repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it('should trim whitespace from title', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        title: '  Test  ',
      });
      if (result.success) {
        expect(result.data.title).toBe('Test');
      }
    });
  });

  describe('amount validation', () => {
    it('should accept valid positive amount', () => {
      const result = transactionFormSchema.safeParse(validTransaction);
      expect(result.success).toBe(true);
    });

    it('should reject zero amount', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        amount: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative amount', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        amount: -100,
      });
      expect(result.success).toBe(false);
    });

    it('should reject amount larger than 999999999', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        amount: 1000000000,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('type validation', () => {
    it('should accept income type', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        type: TRANSACTION_TYPES.INCOME,
      });
      expect(result.success).toBe(true);
    });

    it('should accept expense type', () => {
      const result = transactionFormSchema.safeParse(validTransaction);
      expect(result.success).toBe(true);
    });

    it('should reject invalid type', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        type: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('category validation', () => {
    it('should accept valid categories', () => {
      Object.values(TRANSACTION_CATEGORIES).forEach((category) => {
        const result = transactionFormSchema.safeParse({
          ...validTransaction,
          category,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid category', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        category: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('date validation', () => {
    it('should accept valid date', () => {
      const result = transactionFormSchema.safeParse(validTransaction);
      expect(result.success).toBe(true);
    });

    it('should reject empty date', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        date: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        date: 'invalid-date',
      });
      expect(result.success).toBe(false);
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);
      futureDate.setHours(0, 0, 0, 0);
      const dateString = futureDate.toISOString().split('T')[0];

      const today = new Date();
      today.setHours(23, 59, 59, 999);

      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        date: dateString,
      });
      
      if (futureDate > today) {
        expect(result.success).toBe(false);
      }
    });

    it('should accept today date', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        date: today,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('description validation', () => {
    it('should accept valid description', () => {
      const result = transactionFormSchema.safeParse(validTransaction);
      expect(result.success).toBe(true);
    });

    it('should accept empty description', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        description: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('should reject description longer than 500 characters', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        description: 'A'.repeat(501),
      });
      expect(result.success).toBe(false);
    });

    it('should accept description with exactly 500 characters', () => {
      const result = transactionFormSchema.safeParse({
        ...validTransaction,
        description: 'A'.repeat(500),
      });
      expect(result.success).toBe(true);
    });
  });
});

