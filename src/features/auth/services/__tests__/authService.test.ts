import { authService } from '../authService';
import { apiClient } from '@/lib/api';
import { endpoints } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  apiClient: {
    post: jest.fn(),
  },
  endpoints: {
    auth: {
      login: '/auth/login',
    },
  },
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call apiClient.post with correct endpoint and credentials', async () => {
      const mockResponse = {
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
            role: 'user',
          },
          token: 'test-token',
        },
        message: 'Login successful',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await authService.login('test@example.com', 'password123');

      expect(apiClient.post).toHaveBeenCalledWith(
        endpoints.auth.login,
        {
          email: 'test@example.com',
          password: 'password123',
        }
      );
    });

    it('should return user and token on successful login', async () => {
      const mockResponse = {
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
            role: 'user',
          },
          token: 'test-token',
        },
        message: 'Login successful',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.login('test@example.com', 'password123');

      expect(result).toEqual({
        user: mockResponse.data.user,
        token: mockResponse.data.token,
      });
    });

    it('should throw error on failed login', async () => {
      const error = new Error('Invalid credentials');
      (apiClient.post as jest.Mock).mockRejectedValue(error);

      await expect(
        authService.login('test@example.com', 'wrong-password')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});

