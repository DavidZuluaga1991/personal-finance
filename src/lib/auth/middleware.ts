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
      error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    };
  }

  try {
    const decoded = parseJWT(token);
    
    if (!decoded || !decoded.sub || !decoded.email) {
      return {
        user: null,
        error: NextResponse.json({ message: 'Invalid token: incorrect structure' }, { status: 401 }),
      };
    }

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return {
        user: null,
        error: NextResponse.json({ message: 'Token expired' }, { status: 401 }),
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
          error: NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 }),
        };
      }
    }

    return { user };
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return {
      user: null,
      error: NextResponse.json({ message: 'Invalid token' }, { status: 401 }),
    };
  }
}

