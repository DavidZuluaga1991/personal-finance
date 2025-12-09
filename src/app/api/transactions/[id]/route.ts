import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/database';
import { requireAuth } from '@/lib/auth/middleware';
import { Permission } from '@/features/auth/types/auth.types';
import { canViewTransaction } from '@/lib/auth/permissions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = requireAuth(request, Permission.TRANSACTIONS_VIEW_OWN);
  if (error) return error;
  if (!user) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const transaction = await db.transactions.getById(id);

  if (!transaction) {
    return NextResponse.json(
      { message: 'Transacción no encontrada' },
      { status: 404 }
    );
  }

  const transactionUserId = (transaction as any).userId;
  if (!canViewTransaction(user as any, transactionUserId)) {
    return NextResponse.json(
      { message: 'No tienes permiso para ver esta transacción' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    data: transaction,
    message: 'Transacción obtenida exitosamente',
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = requireAuth(request, Permission.TRANSACTIONS_EDIT_OWN);
    if (error) return error;
    if (!user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const transaction = await db.transactions.getById(id);

    if (!transaction) {
      return NextResponse.json(
        { message: 'Transacción no encontrada' },
        { status: 404 }
      );
    }

    const transactionUserId = (transaction as any).userId;
    const { canEditTransaction } = await import('@/lib/auth/permissions');
    if (!canEditTransaction(user as any, transactionUserId)) {
      return NextResponse.json(
        { message: 'No tienes permiso para editar esta transacción' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updated = await db.transactions.update(id, {
      ...body,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      data: updated,
      message: 'Transacción actualizada exitosamente',
    });
  } catch {
    return NextResponse.json(
      { message: 'Error al actualizar transacción' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = requireAuth(request, Permission.TRANSACTIONS_DELETE_OWN);
  if (error) return error;
  if (!user) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const transaction = await db.transactions.getById(id);

  if (!transaction) {
    return NextResponse.json(
      { message: 'Transacción no encontrada' },
      { status: 404 }
    );
  }

    const transactionUserId = (transaction as any).userId;
    const { canDeleteTransaction } = await import('@/lib/auth/permissions');
    if (!canDeleteTransaction(user as any, transactionUserId)) {
    return NextResponse.json(
      { message: 'No tienes permiso para eliminar esta transacción' },
      { status: 403 }
    );
  }

  const deleted = await db.transactions.delete(id);

  return NextResponse.json({
    message: 'Transacción eliminada exitosamente',
  });
}

