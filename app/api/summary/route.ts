import { NextResponse } from 'next/server';
import { mockDb } from '@/data/mock-db';

export async function GET() {
  const transactions = mockDb.transactions.getAll();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  return NextResponse.json({
    data: {
      totalIncome,
      totalExpenses,
      netBalance,
    },
    message: 'Resumen obtenido exitosamente',
  });
}

