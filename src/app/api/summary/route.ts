import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET() {
  const transactions = await db.transactions.getAll();

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

