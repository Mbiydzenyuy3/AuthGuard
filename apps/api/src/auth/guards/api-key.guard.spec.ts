import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyGuard } from './api-key.guard';
import { ApiKeyService } from '../../user/api-key.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let apiKeyService: jest.Mocked<ApiKeyService>;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    cognitoSub: 'cognito-123',
    name: 'Test User',
  };

  const mockApiKey = {
    id: 'api-key-123',
    key: 'ak_123e4567-e89b-12d3-a456-426614174000',
    name: 'Test API Key',
    user: mockUser,
    createdAt: new Date(),
    lastUsed: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        {
          provide: ApiKeyService,
          useValue: {
            getValidApiKey: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<ApiKeyGuard>(ApiKeyGuard);
    apiKeyService = module.get(ApiKeyService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let context: jest.Mocked<ExecutionContext>;
    let request: any;

    beforeEach(() => {
      request = {
        headers: {},
        query: {},
      };
      context = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: () => request,
        }),
      } as any;
    });

    it('should allow access with valid API key in header', async () => {
      request.headers['x-api-key'] = mockApiKey.key;
      apiKeyService.getValidApiKey.mockResolvedValue(mockApiKey as any);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(apiKeyService.getValidApiKey).toHaveBeenCalledWith(mockApiKey.key);
      expect(request.apiKey).toEqual(mockApiKey);
      expect(request.user).toEqual(mockUser);
    });

    it('should allow access with valid API key in uppercase header', async () => {
      request.headers['X-API-KEY'] = mockApiKey.key;
      apiKeyService.getValidApiKey.mockResolvedValue(mockApiKey as any);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(apiKeyService.getValidApiKey).toHaveBeenCalledWith(mockApiKey.key);
    });

    it('should allow access with valid API key in query parameter', async () => {
      request.query.apiKey = mockApiKey.key;
      apiKeyService.getValidApiKey.mockResolvedValue(mockApiKey as any);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(apiKeyService.getValidApiKey).toHaveBeenCalledWith(mockApiKey.key);
      expect(request.apiKey).toEqual(mockApiKey);
      expect(request.user).toEqual(mockUser);
    });

    it('should reject when no API key provided', async () => {
      apiKeyService.getValidApiKey.mockResolvedValue(null);

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(apiKeyService.getValidApiKey).not.toHaveBeenCalled();
    });

    it('should reject when API key is empty string', async () => {
      request.headers['x-api-key'] = '';
      apiKeyService.getValidApiKey.mockResolvedValue(null);

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(apiKeyService.getValidApiKey).not.toHaveBeenCalled();
    });

    it('should reject when API key is null', async () => {
      request.headers['x-api-key'] = null;
      request.query.apiKey = null;
      apiKeyService.getValidApiKey.mockResolvedValue(null);

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(apiKeyService.getValidApiKey).not.toHaveBeenCalled();
    });

    it('should reject when API key is invalid', async () => {
      request.headers['x-api-key'] = 'invalid-key';
      apiKeyService.getValidApiKey.mockResolvedValue(null);

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(apiKeyService.getValidApiKey).toHaveBeenCalledWith('invalid-key');
    });

    it('should reject when API key service throws error', async () => {
      request.headers['x-api-key'] = mockApiKey.key;
      apiKeyService.getValidApiKey.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(apiKeyService.getValidApiKey).toHaveBeenCalledWith(mockApiKey.key);
    });

    it('should prioritize header over query parameter', async () => {
      request.headers['x-api-key'] = mockApiKey.key;
      request.query.apiKey = 'different-key';
      apiKeyService.getValidApiKey.mockResolvedValue(mockApiKey as any);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(apiKeyService.getValidApiKey).toHaveBeenCalledWith(mockApiKey.key);
    });

    it('should handle API keys with ak_ prefix', async () => {
      request.headers['x-api-key'] = `ak_${mockApiKey.key}`;
      apiKeyService.getValidApiKey.mockResolvedValue(mockApiKey as any);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(apiKeyService.getValidApiKey).toHaveBeenCalledWith(
        `ak_${mockApiKey.key}`,
      );
    });

    it('should handle API keys without ak_ prefix', async () => {
      request.headers['x-api-key'] = mockApiKey.key.substring(3); // Remove 'ak_' prefix
      apiKeyService.getValidApiKey.mockResolvedValue(mockApiKey as any);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(apiKeyService.getValidApiKey).toHaveBeenCalledWith(
        mockApiKey.key.substring(3),
      );
    });
  });
});
