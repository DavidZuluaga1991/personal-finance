import { parseJWT, isJWTExpired } from '../jwt';

describe('jwt', () => {
  describe('parseJWT', () => {
    it('should parse valid JWT token correctly', () => {
      const payload = { sub: 1, email: 'test@example.com', role: 'user' };
      const token = createMockJWT(payload);
      
      const decoded = parseJWT(token);
      
      expect(decoded).toBeTruthy();
      expect(decoded?.sub).toBe(1);
      expect(decoded?.email).toBe('test@example.com');
      expect(decoded?.role).toBe('user');
    });

    it('should return null for invalid token format', () => {
      expect(parseJWT('invalid')).toBeNull();
      expect(parseJWT('not.a.token')).toBeNull();
      expect(parseJWT('only.two.parts')).toBeNull();
      expect(parseJWT('')).toBeNull();
    });

    it('should handle tokens with expiration', () => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const payload = { sub: 1, email: 'test@example.com', exp };
      const token = createMockJWT(payload);
      
      const decoded = parseJWT(token);
      
      expect(decoded?.exp).toBe(exp);
    });
  });

  describe('isJWTExpired', () => {
    it('should return false for non-expired token', () => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const payload = { sub: 1, email: 'test@example.com', exp };
      const token = createMockJWT(payload);
      
      expect(isJWTExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      const exp = Math.floor(Date.now() / 1000) - 3600;
      const payload = { sub: 1, email: 'test@example.com', exp };
      const token = createMockJWT(payload);
      
      expect(isJWTExpired(token)).toBe(true);
    });

    it('should return true for token without expiration', () => {
      const payload = { sub: 1, email: 'test@example.com' };
      const token = createMockJWT(payload);
      
      expect(isJWTExpired(token)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isJWTExpired('invalid.token')).toBe(true);
      expect(isJWTExpired('')).toBe(true);
    });
  });
});

function createMockJWT(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

