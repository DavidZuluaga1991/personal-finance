import { NextRequest, NextResponse } from 'next/server';
import { Permission, UserRole } from '@/features/auth/types/auth.types';
import { parseJWT } from '@/lib/utils/jwt';
import { hasPermission } from './permissions';

interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export function requireAuth(
  request: NextRequest,
  requiredPermission?: Permission
): { user: AuthUser | null; error?: NextResponse } {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return {
      user: null,
      error: NextResponse.json({ message: 'No autorizado' }, { status: 401 }),
    };
  }

  try {
    const decoded = parseJWT(token);
    const user: AuthUser = {
      id: decoded.sub as number,
      email: decoded.email as string,
      role: (decoded.role as UserRole) || UserRole.USER,
    };

    if (requiredPermission && !hasPermission(user as any, requiredPermission)) {
      return {
        user: null,
        error: NextResponse.json({ message: 'Permisos insuficientes' }, { status: 403 }),
      };
    }

    return { user };
  } catch {
    return {
      user: null,
      error: NextResponse.json({ message: 'Token inválido' }, { status: 401 }),
    };
  }
}

