import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET() {
  const transactions = await db.transactions.getAll();
  return NextResponse.json({
    data: transactions,
    message: 'Transacciones obtenidas exitosamente',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTransaction = {
      id: `t${Date.now()}`,
      ...body,
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

