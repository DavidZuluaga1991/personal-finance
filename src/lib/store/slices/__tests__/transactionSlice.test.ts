import { renderHook, act } from '@testing-library/react';
import { useTransactionStore } from '../transactionSlice';
import type { Transaction } from '@/features/transactions/types/transaction.types';

describe('transactionSlice', () => {
  beforeEach(() => {
    localStorage.clear();
    const { result } = renderHook(() => useTransactionStore());
    act(() => {
      result.current.clearList();
    });
  });

  const createTransaction = (id: string, amount: number): Transaction => ({
    id,
    userId: 1,
    title: `Transaction ${id}`,
    amount,
    type: 'expense',
    category: 'food',
    date: '2024-01-01',
  });

  it('should initialize with empty list', () => {
    const { result } = renderHook(() => useTransactionStore());
    
    expect(result.current.list).toEqual([]);
  });

  it('should set list of transactions', () => {
    const { result } = renderHook(() => useTransactionStore());
    const transactions = [
      createTransaction('t1', 100),
      createTransaction('t2', 200),
    ];

    act(() => {
      result.current.setList(transactions);
    });

    expect(result.current.list).toEqual(transactions);
    expect(result.current.list.length).toBe(2);
  });

  it('should add transaction to list', () => {
    const { result } = renderHook(() => useTransactionStore());
    const transaction = createTransaction('t1', 100);

    act(() => {
      result.current.add(transaction);
    });

    expect(result.current.list).toHaveLength(1);
    expect(result.current.list[0]).toEqual(transaction);
  });

  it('should update existing transaction', () => {
    const { result } = renderHook(() => useTransactionStore());
    const transaction = createTransaction('t1', 100);

    act(() => {
      result.current.add(transaction);
    });

    act(() => {
      result.current.update('t1', { amount: 200 });
    });

    expect(result.current.list[0].amount).toBe(200);
    expect(result.current.list[0].title).toBe('Transaction t1');
  });

  it('should remove transaction from list', () => {
    const { result } = renderHook(() => useTransactionStore());
    const transactions = [
      createTransaction('t1', 100),
      createTransaction('t2', 200),
    ];

    act(() => {
      result.current.setList(transactions);
    });

    act(() => {
      result.current.remove('t1');
    });

    expect(result.current.list).toHaveLength(1);
    expect(result.current.list[0].id).toBe('t2');
  });

  it('should clear list', () => {
    const { result } = renderHook(() => useTransactionStore());
    const transactions = [
      createTransaction('t1', 100),
      createTransaction('t2', 200),
    ];

    act(() => {
      result.current.setList(transactions);
    });

    expect(result.current.list.length).toBe(2);

    act(() => {
      result.current.clearList();
    });

    expect(result.current.list).toEqual([]);
  });
});

