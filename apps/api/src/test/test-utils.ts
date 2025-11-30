import { User } from '../user/entity/user.entity';
import { ApiKey } from '../user/entity/api-key.entity';
import { Session } from '../user/entity/session.entity';
import { randomUUID } from 'crypto';

export const createMockUser = (
  overrides: Partial<User> = {},
): Partial<User> => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  cognitoSub: 'cognito-123',
  name: 'Test User',
  role: 'developer',
  ...overrides,
});

export const createMockApiKey = (
  overrides: Partial<ApiKey> = {},
): Partial<ApiKey> => ({
  id: 'api-key-123',
  key: 'ak_123e4567-e89b-12d3-a456-426614174000',
  name: 'Test API Key',
  createdAt: new Date(),
  lastUsed: undefined,
  user: createMockUser() as User,
  ...overrides,
});

export const createMockSession = (
  overrides: Partial<Session> = {},
): Partial<Session> => ({
  id: 'session-123',
  refreshToken: 'refresh-token-123',
  userAgent: 'Mozilla/5.0',
  ipAddress: '192.168.1.1',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: new Date(),
  user: createMockUser() as User,
  ...overrides,
});

export const generateValidApiKey = (): string => {
  return `ak_${randomUUID ? randomUUID() : '123e4567-e89b-12d3-a456-426614174000'}`;
};

export const createMockExecutionContext = (
  headers: Record<string, any> = {},
  query: Record<string, any> = {},
): any => {
  const request = {
    headers,
    query,
  };

  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  };
};

export const expectApiKeyFormat = (apiKey: string): void => {
  expect(apiKey).toMatch(
    /^ak_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  );
};

export const createRepositoryMocks = <T>(entityName: string) => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  })),
  [`${entityName}Repo`]: {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  },
});

export const mockLogger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};
