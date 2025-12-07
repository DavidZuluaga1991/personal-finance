import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockTransactions: any[] = [];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const transaction = mockTransactions.find((t) => t.id === params.id);

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
    const index = mockTransactions.findIndex((t) => t.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { message: 'Transacción no encontrada' },
        { status: 404 }
      );
    }

    mockTransactions[index] = {
      ...mockTransactions[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      data: mockTransactions[index],
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
  const index = mockTransactions.findIndex((t) => t.id === params.id);

  if (index === -1) {
    return NextResponse.json(
      { message: 'Transacción no encontrada' },
      { status: 404 }
    );
  }

  mockTransactions.splice(index, 1);

  return NextResponse.json({
    message: 'Transacción eliminada exitosamente',
  });
}

