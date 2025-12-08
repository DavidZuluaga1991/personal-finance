import { z } from 'zod';
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '@/lib/utils/constants';

export const transactionFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .max(999999999, 'Amount is too large')
    .refine((val) => val > 0, {
      message: 'Amount must be greater than 0',
    }),
  type: z.enum([TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE], {
    errorMap: () => ({ message: 'Type must be either income or expense' }),
  }),
  category: z.enum(
    [
      TRANSACTION_CATEGORIES.SALARY,
      TRANSACTION_CATEGORIES.FREELANCE,
      TRANSACTION_CATEGORIES.INVESTMENT,
      TRANSACTION_CATEGORIES.FOOD,
      TRANSACTION_CATEGORIES.TRANSPORT,
      TRANSACTION_CATEGORIES.ENTERTAINMENT,
      TRANSACTION_CATEGORIES.SUBSCRIPTIONS,
      TRANSACTION_CATEGORIES.SHOPPING,
      TRANSACTION_CATEGORIES.HEALTH,
      TRANSACTION_CATEGORIES.OTHER,
    ],
    {
      errorMap: () => ({ message: 'Invalid category' }),
    }
  ),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine(
      (date) => {
        const dateObj = new Date(date);
        return !isNaN(dateObj.getTime());
      },
      { message: 'Invalid date format' }
    )
    .refine(
      (date) => {
        const dateObj = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return dateObj <= today;
      },
      { message: 'Date cannot be in the future' }
    ),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
});

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;

