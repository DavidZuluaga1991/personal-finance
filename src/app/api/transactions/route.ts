import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/database';
import { requireAuth } from '@/lib/auth/middleware';
import { Permission } from '@/features/auth/types/auth.types';
import { UserRole } from '@/features/auth/types/auth.types';

export async function GET(request: NextRequest) {
  const { user, error } = requireAuth(request, Permission.TRANSACTIONS_VIEW_OWN);
  if (error) return error;
  if (!user) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const transactions = await db.transactions.getAll();

  if (user.role === UserRole.ADMIN || user.role === 'admin') {
    return NextResponse.json({
      data: transactions,
      message: 'Transacciones obtenidas exitosamente',
    });
  }

  const userTransactions = transactions.filter((t: any) => t.userId === user.id);
  return NextResponse.json({
    data: userTransactions,
    message: 'Transacciones obtenidas exitosamente',
  });
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = requireAuth(request, Permission.TRANSACTIONS_CREATE);
    if (error) return error;
    if (!user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const newTransaction = {
      id: `t${Date.now()}`,
      ...body,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = await db.transactions.add(newTransaction);

    return NextResponse.json({
      data: created,
      message: 'Transacción creada exitosamente',
    });
  } catch {
    return NextResponse.json(
      { message: 'Error al crear transacción' },
      { status: 500 }
    );
  }
}

