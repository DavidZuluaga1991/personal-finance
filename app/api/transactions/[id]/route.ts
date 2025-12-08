import { NextResponse } from 'next/server';
import { mockDb } from '@/data/mock-db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const transaction = mockDb.transactions.getById(params.id);

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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = mockDb.transactions.update(params.id, {
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
  { params }: { params: { id: string } }
) {
  const deleted = mockDb.transactions.delete(params.id);

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

