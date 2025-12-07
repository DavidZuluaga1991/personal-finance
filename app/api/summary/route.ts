import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: {
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
    },
    message: 'Resumen obtenido exitosamente',
  });
}

