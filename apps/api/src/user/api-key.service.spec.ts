import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyService } from './api-key.service';
import { ApiKey } from './entity/api-key.entity';
import { User } from './entity/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ApiKeyService', () => {
  let service: ApiKeyService;
  let apiKeysRepo: jest.Mocked<Repository<ApiKey>>;
  let usersRepo: jest.Mocked<Repository<User>>;

  const mockUser: Partial<User> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    cognitoSub: 'cognito-123',
    name: 'Test User',
  };

  const mockApiKey: Partial<ApiKey> = {
    id: 'api-key-123',
    key: 'ak_test-key-123',
    name: 'Test API Key',
    user: mockUser as User,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
        {
          provide: getRepositoryToken(ApiKey),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);
    apiKeysRepo = module.get(getRepositoryToken(ApiKey));
    usersRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateApiKey', () => {
    it('should generate a valid API key', () => {
      const key = service.generateApiKey();
      expect(key).toMatch(
        /^ak_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
      expect(key.startsWith('ak_')).toBe(true);
    });
  });

  describe('createApiKey', () => {
    it('should create a new API key successfully', async () => {
      usersRepo.findOne.mockResolvedValue(mockUser as User);
      apiKeysRepo.findOne.mockResolvedValue(null);
      apiKeysRepo.create.mockReturnValue(mockApiKey as ApiKey);
      apiKeysRepo.save.mockResolvedValue(mockApiKey as ApiKey);

      const result = await service.createApiKey(mockUser.id!, 'Test Key');

      expect(usersRepo.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(apiKeysRepo.findOne).toHaveBeenCalledWith({
        where: { name: 'Test Key' },
      });
      expect(result).toEqual(mockApiKey);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepo.findOne.mockResolvedValue(null);

      await expect(service.createApiKey('non-existent-user')).rejects.toThrow(
        NotFoundException,
      );
      expect(usersRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent-user' },
      });
    });

    it('should throw BadRequestException when API key with same name exists', async () => {
      usersRepo.findOne.mockResolvedValue(mockUser as User);
      apiKeysRepo.findOne.mockResolvedValue(mockApiKey as ApiKey);

      await expect(
        service.createApiKey(mockUser.id!, 'Duplicate Key'),
      ).rejects.toThrow(BadRequestException);
      expect(apiKeysRepo.findOne).toHaveBeenCalledWith({
        where: { name: 'Duplicate Key' },
      });
    });
  });

  describe('getApiKeysByUserId', () => {
    it('should return API keys for a user', async () => {
      const mockKeys = [
        mockApiKey,
        { ...mockApiKey, id: 'api-key-456' },
      ] as ApiKey[];
      apiKeysRepo.find.mockResolvedValue(mockKeys);

      const result = await service.getApiKeysByUserId(mockUser.id!);

      expect(apiKeysRepo.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockKeys);
    });
  });

  describe('getApiKeyByKey', () => {
    it('should return API key when found', async () => {
      apiKeysRepo.findOne.mockResolvedValue(mockApiKey as ApiKey);

      const result = await service.getApiKeyByKey('ak_test-key-123');

      expect(apiKeysRepo.findOne).toHaveBeenCalledWith({
        where: { key: 'ak_test-key-123' },
        relations: ['user'],
      });
      expect(result).toEqual(mockApiKey);
    });

    it('should return null when API key not found', async () => {
      apiKeysRepo.findOne.mockResolvedValue(null);

      const result = await service.getApiKeyByKey('non-existent-key');

      expect(result).toBeNull();
    });
  });

  describe('revokeApiKey', () => {
    it('should delete API key successfully', async () => {
      apiKeysRepo.delete.mockResolvedValue({ affected: 1 } as any);

      await service.revokeApiKey('api-key-123');

      expect(apiKeysRepo.delete).toHaveBeenCalledWith('api-key-123');
    });

    it('should throw NotFoundException when API key does not exist', async () => {
      apiKeysRepo.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.revokeApiKey('non-existent-key')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('validateApiKey', () => {
    it('should return true for valid API key', async () => {
      apiKeysRepo.findOne.mockResolvedValue(mockApiKey as ApiKey);

      const result = await service.validateApiKey('ak_test-key-123');

      expect(result).toBe(true);
    });

    it('should return false for invalid API key', async () => {
      apiKeysRepo.findOne.mockResolvedValue(null);

      const result = await service.validateApiKey('invalid-key');

      expect(result).toBe(false);
    });
  });

  describe('updateLastUsed', () => {
    it('should update lastUsed timestamp', async () => {
      const updatedKey = { ...mockApiKey, lastUsed: new Date() } as ApiKey;
      apiKeysRepo.findOne.mockResolvedValue(mockApiKey as ApiKey);
      apiKeysRepo.save.mockResolvedValue(updatedKey);

      const result = await service.updateLastUsed('api-key-123');

      expect(apiKeysRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'api-key-123' },
        relations: ['user'],
      });
      expect(result.lastUsed).toBeDefined();
    });

    it('should throw NotFoundException when API key does not exist', async () => {
      apiKeysRepo.findOne.mockResolvedValue(null);

      await expect(service.updateLastUsed('non-existent-key')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
