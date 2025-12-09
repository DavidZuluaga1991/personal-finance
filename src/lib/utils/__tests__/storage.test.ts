import { storage } from '../storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('get', () => {
    it('should retrieve stored value', () => {
      localStorage.setItem('test-key', JSON.stringify({ data: 'test' }));
      
      const value = storage.get('test-key');
      
      expect(value).toEqual({ data: 'test' });
    });

    it('should return null for non-existent key', () => {
      const value = storage.get('non-existent');
      
      expect(value).toBeNull();
    });

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('invalid-key', 'invalid-json');
      
      const value = storage.get('invalid-key');
      
      expect(value).toBeNull();
    });
  });

  describe('set', () => {
    it('should store value in localStorage', () => {
      const data = { test: 'value' };
      
      storage.set('test-key', data);
      
      const stored = localStorage.getItem('test-key');
      expect(stored).toBe(JSON.stringify(data));
    });

    it('should overwrite existing value', () => {
      storage.set('test-key', { old: 'value' });
      storage.set('test-key', { new: 'value' });
      
      const value = storage.get('test-key');
      expect(value).toEqual({ new: 'value' });
    });
  });

  describe('remove', () => {
    it('should remove key from localStorage', () => {
      localStorage.setItem('test-key', 'value');
      
      storage.remove('test-key');
      
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('should not throw error if key does not exist', () => {
      expect(() => storage.remove('non-existent')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      
      storage.clear();
      
      expect(localStorage.length).toBe(0);
    });
  });
});

