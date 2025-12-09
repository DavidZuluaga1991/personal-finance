export function parseJWT(token: string) {
  try {
    // Validar que el token tenga el formato correcto (3 partes separadas por puntos)
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      return null;
    }

    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    // Retornar null en caso de error, pero no loggear aquí (se loggea en el middleware)
    return null;
  }
}

export function isJWTExpired(token: string): boolean {
  const decoded = parseJWT(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

