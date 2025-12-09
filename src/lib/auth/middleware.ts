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
    
    // Validar que el token tiene la estructura correcta
    if (!decoded || !decoded.sub || !decoded.email) {
      return {
        user: null,
        error: NextResponse.json({ message: 'Token inválido: estructura incorrecta' }, { status: 401 }),
      };
    }

    // Verificar expiración del token
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return {
        user: null,
        error: NextResponse.json({ message: 'Token expirado' }, { status: 401 }),
      };
    }

    const user: AuthUser = {
      id: decoded.sub as number,
      email: decoded.email as string,
      role: (decoded.role as UserRole) || UserRole.USER,
    };

    if (requiredPermission && user.role !== UserRole.ADMIN && user.role !== 'admin') {
      if (!hasPermission(user as any, requiredPermission)) {
        return {
          user: null,
          error: NextResponse.json({ message: 'Permisos insuficientes' }, { status: 403 }),
        };
      }
    }

    return { user };
  } catch (error) {
    // Loggear el error para debugging pero no exponer detalles al cliente
    console.error('Error parsing JWT:', error);
    return {
      user: null,
      error: NextResponse.json({ message: 'Token inválido' }, { status: 401 }),
    };
  }
}

