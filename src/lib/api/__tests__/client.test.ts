import { apiClient } from '../client';

global.fetch = jest.fn();

describe('apiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('get', () => {
    it('should make GET request with correct URL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: { test: 'value' }, message: 'Success' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should include Authorization header when token exists', async () => {
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: { token: 'test-token' },
        })
      );

      const mockResponse = {
        ok: true,
        json: async () => ({ data: {}, message: 'Success' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });
  });

  describe('post', () => {
    it('should make POST request with body', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: {}, message: 'Success' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const data = { test: 'value' };
      await apiClient.post('/test', data);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data),
        })
      );
    });
  });

  describe('error handling', () => {
    it('should throw error with status code on failed request', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Not found' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        status: 404,
      });
    });

    it('should clear auth storage on 401 error', async () => {
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: { token: 'test-token' },
        })
      );

      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: 'Unauthorized' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      try {
        await apiClient.get('/test');
      } catch {
      }

      expect(localStorage.getItem('auth-storage')).toBeNull();
    });
  });
});

