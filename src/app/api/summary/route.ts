import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/database';
import { requireAuth } from '@/lib/auth/middleware';
import { Permission } from '@/features/auth/types/auth.types';
import { UserRole } from '@/features/auth/types/auth.types';

export async function GET(request: NextRequest) {
  const { user, error } = requireAuth(request, Permission.SUMMARY_VIEW_OWN);
  if (error) return error;
  if (!user) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const transactions = await db.transactions.getAll();

  let filteredTransactions = transactions;
  if (user.role !== UserRole.ADMIN && user.role !== 'admin') {
    filteredTransactions = transactions.filter((t: any) => t.userId === user.id);
  }

  const totalIncome = filteredTransactions
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

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

