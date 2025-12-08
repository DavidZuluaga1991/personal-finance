import { NextResponse } from 'next/server';
import { mockDb } from '@/data/mock-db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const transaction = mockDb.transactions.getById(id);

  if (!transaction) {
    return NextResponse.json(
      { message: 'Transacción no encontrada' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: transaction,
    message: 'Transacción obtenida exitosamente',
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = mockDb.transactions.update(id, {
      ...body,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      return NextResponse.json(
        { message: 'Transacción no encontrada' },
        { status: 404 }
      );
    }

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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = mockDb.transactions.delete(id);

  if (!deleted) {
    return NextResponse.json(
      { message: 'Transacción no encontrada' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: 'Transacción eliminada exitosamente',
  });
}

