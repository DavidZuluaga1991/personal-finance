import { isValidEmail, isValidPassword, isValidAmount } from '../validators';

describe('validators', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
      expect(isValidEmail('user123@test-domain.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('invalid@.com')).toBe(false);
      expect(isValidEmail('invalid@com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid email@example.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should return true for passwords with 6 or more characters', () => {
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('password')).toBe(true);
      expect(isValidPassword('verylongpassword123')).toBe(true);
    });

    it('should return false for passwords with less than 6 characters', () => {
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('pass')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('isValidAmount', () => {
    it('should return true for positive numbers', () => {
      expect(isValidAmount(1)).toBe(true);
      expect(isValidAmount(100)).toBe(true);
      expect(isValidAmount(0.01)).toBe(true);
      expect(isValidAmount(999999.99)).toBe(true);
    });

    it('should return false for zero or negative numbers', () => {
      expect(isValidAmount(0)).toBe(false);
      expect(isValidAmount(-1)).toBe(false);
      expect(isValidAmount(-100)).toBe(false);
    });

    it('should return false for non-finite numbers', () => {
      expect(isValidAmount(Infinity)).toBe(false);
      expect(isValidAmount(-Infinity)).toBe(false);
      expect(isValidAmount(NaN)).toBe(false);
    });
  });
});

