import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

const SECRET = process.env.JWT_SECRET || 'dev-secret-key';

function generateToken(userId: number, email: string, role: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const TWENTY_FOUR_HOURS_IN_SECONDS = 24 * 60 * 60; // 86400 segundos
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      email,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TWENTY_FOUR_HOURS_IN_SECONDS,
    })
  ).toString('base64url');
  const signature = Buffer.from(SECRET).toString('base64url');
  return `${header}.${payload}.${signature}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await db.users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const token = generateToken(user.id, user.email, user.role || 'user');

    return NextResponse.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'user',
        },
        token,
      },
      message: 'Login exitoso',
    });
  } catch {
    return NextResponse.json(
      { message: 'Error en el servidor' },
      { status: 500 }
    );
  }
}

