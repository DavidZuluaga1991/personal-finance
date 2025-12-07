import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (email === 'test@example.com' && password === 'password123') {
      return NextResponse.json({
        data: {
          user: {
            id: '1',
            email: email,
            name: 'Test User',
          },
          token: 'mock-jwt-token-' + Date.now(),
        },
        message: 'Login exitoso',
      });
    }

    return NextResponse.json(
      { message: 'Credenciales inválidas' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Error en el servidor' },
      { status: 500 }
    );
  }
}

