import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockTransactions: any[] = [];

export async function GET() {
  return NextResponse.json({
    data: mockTransactions,
    message: 'Transacciones obtenidas exitosamente',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTransaction = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockTransactions.push(newTransaction);

    return NextResponse.json({
      data: newTransaction,
      message: 'Transacción creada exitosamente',
    });
  } catch {
    return NextResponse.json(
      { message: 'Error al crear transacción' },
      { status: 500 }
    );
  }
}

