import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionService } from './session.service';
import { Session } from './entity/session.entity';
import { User } from './entity/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('SessionService', () => {
  let service: SessionService;
  let sessionsRepo: jest.Mocked<Repository<Session>>;
  let usersRepo: jest.Mocked<Repository<User>>;

  const mockUser: Partial<User> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    cognitoSub: 'cognito-123',
    name: 'Test User',
  };

  const mockSession: Partial<Session> = {
    id: 'session-123',
    refreshToken: 'refresh-token-123',
    user: mockUser as User,
    userAgent: 'Mozilla/5.0',
    ipAddress: '192.168.1.1',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: getRepositoryToken(Session),
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

    service = module.get<SessionService>(SessionService);
    sessionsRepo = module.get(getRepositoryToken(Session));
    usersRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSession', () => {
    it('should create a new session successfully', async () => {
      usersRepo.findOne.mockResolvedValue(mockUser as User);
      sessionsRepo.create.mockReturnValue(mockSession as Session);
      sessionsRepo.save.mockResolvedValue(mockSession as Session);

      const result = await service.createSession(
        mockUser.id!,
        'refresh-token-123',
        'Mozilla/5.0',
        '192.168.1.1',
        24,
      );

      expect(usersRepo.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual(mockSession);
      expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepo.findOne.mockResolvedValue(null);

      await expect(
        service.createSession('non-existent-user', 'refresh-token'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSessionsByUserId', () => {
    it('should return sessions for a user', async () => {
      const mockSessions = [
        mockSession,
        { ...mockSession, id: 'session-456' },
      ] as Session[];
      sessionsRepo.find.mockResolvedValue(mockSessions);

      const result = await service.getSessionsByUserId(mockUser.id!);

      expect(sessionsRepo.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockSessions);
    });
  });

  describe('getSessionByRefreshToken', () => {
    it('should return session when found', async () => {
      sessionsRepo.findOne.mockResolvedValue(mockSession as Session);

      const result =
        await service.getSessionByRefreshToken('refresh-token-123');

      expect(sessionsRepo.findOne).toHaveBeenCalledWith({
        where: { refreshToken: 'refresh-token-123' },
        relations: ['user'],
      });
      expect(result).toEqual(mockSession);
    });

    it('should return null when session not found', async () => {
      sessionsRepo.findOne.mockResolvedValue(null);

      const result =
        await service.getSessionByRefreshToken('non-existent-token');

      expect(result).toBeNull();
    });
  });

  describe('revokeSession', () => {
    it('should delete session successfully', async () => {
      sessionsRepo.delete.mockResolvedValue({ affected: 1 } as any);

      await service.revokeSession('session-123');

      expect(sessionsRepo.delete).toHaveBeenCalledWith('session-123');
    });

    it('should throw NotFoundException when session does not exist', async () => {
      sessionsRepo.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(
        service.revokeSession('non-existent-session'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('revokeAllUserSessions', () => {
    it('should delete all user sessions', async () => {
      await service.revokeAllUserSessions(mockUser.id!);

      expect(sessionsRepo.delete).toHaveBeenCalledWith({
        user: { id: mockUser.id },
      });
    });
  });

  describe('getSessionById', () => {
    it('should return session when found', async () => {
      sessionsRepo.findOne.mockResolvedValue(mockSession as Session);

      const result = await service.getSessionById('session-123');

      expect(sessionsRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'session-123' },
        relations: ['user'],
      });
      expect(result).toEqual(mockSession);
    });

    it('should return null when session not found', async () => {
      sessionsRepo.findOne.mockResolvedValue(null);

      const result = await service.getSessionById('non-existent-session');

      expect(result).toBeNull();
    });
  });

  describe('isSessionExpired', () => {
    it('should return false for non-expired session', async () => {
      const futureSession = {
        ...mockSession,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      } as Session;
      sessionsRepo.findOne.mockResolvedValue(futureSession);

      const result = await service.isSessionExpired('session-123');

      expect(result).toBe(false);
    });

    it('should return true for expired session', async () => {
      const pastSession = {
        ...mockSession,
        expiresAt: new Date(Date.now() - 60 * 60 * 1000),
      } as Session;
      sessionsRepo.findOne.mockResolvedValue(pastSession);

      const result = await service.isSessionExpired('session-123');

      expect(result).toBe(true);
    });

    it('should return true for non-existent session', async () => {
      sessionsRepo.findOne.mockResolvedValue(null);

      const result = await service.isSessionExpired('non-existent-session');

      expect(result).toBe(true);
    });
  });

  describe('cleanExpiredSessions', () => {
    it('should clean expired sessions', async () => {
      const expiredSessions = [
        {
          ...mockSession,
          id: 'expired-session-1',
          expiresAt: new Date(Date.now() - 60 * 60 * 1000),
          user: mockUser,
        },
      ] as Session[];

      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(expiredSessions),
      } as any;

      sessionsRepo.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      sessionsRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.cleanExpiredSessions();

      expect(result.cleaned).toBe(1);
      expect(sessionsRepo.createQueryBuilder).toHaveBeenCalledWith('session');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'session.user',
        'user',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'session.expiresAt < :now',
        {
          now: expect.any(Date),
        },
      );
    });

    it('should handle errors gracefully', async () => {
      const expiredSessions = [
        {
          ...mockSession,
          id: 'expired-session-1',
          expiresAt: new Date(Date.now() - 60 * 60 * 1000),
          user: mockUser,
        },
      ] as Session[];

      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(expiredSessions),
      } as any;

      sessionsRepo.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      sessionsRepo.delete.mockRejectedValue(new Error('Database error'));

      const result = await service.cleanExpiredSessions();

      expect(result.cleaned).toBe(0);
    });
  });
});
