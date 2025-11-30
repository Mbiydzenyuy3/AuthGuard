import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entity/session.entity';
import { User } from './entity/user.entity';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(Session)
    private sessionsRepo: Repository<Session>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createSession(
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
    expiresInHours: number = 24,
  ): Promise<Session> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const session = this.sessionsRepo.create({
      user,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt,
    });

    return this.sessionsRepo.save(session);
  }

  async getSessionsByUserId(userId: string): Promise<Session[]> {
    return this.sessionsRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSessionByRefreshToken(
    refreshToken: string,
  ): Promise<Session | null> {
    return this.sessionsRepo.findOne({
      where: { refreshToken },
      relations: ['user'],
    });
  }

  async revokeSession(sessionId: string): Promise<void> {
    const result = await this.sessionsRepo.delete(sessionId);
    if (result.affected === 0) {
      throw new NotFoundException('Session not found');
    }
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.sessionsRepo.delete({ user: { id: userId } });
  }

  async revokeSessionByToken(refreshToken: string): Promise<void> {
    const result = await this.sessionsRepo.delete({ refreshToken });
    if (result.affected === 0) {
      throw new NotFoundException('Session not found');
    }
  }

  async updateSessionActivity(sessionId: string): Promise<Session> {
    const session = await this.sessionsRepo.findOne({
      where: { id: sessionId },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.updatedAt = new Date();
    return this.sessionsRepo.save(session);
  }

  async getSessionById(sessionId: string): Promise<Session | null> {
    return this.sessionsRepo.findOne({
      where: { id: sessionId },
      relations: ['user'],
    });
  }

  async isSessionExpired(sessionId: string): Promise<boolean> {
    const session = await this.getSessionById(sessionId);
    if (!session) return true;
    return new Date() > new Date(session.expiresAt);
  }

  async getExpiredSessions(): Promise<Session[]> {
    const now = new Date();
    return this.sessionsRepo
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.user', 'user')
      .where('session.expiresAt < :now', { now })
      .getMany();
  }

  async cleanExpiredSessions(
    cognitoService?: any,
    apiKeyService?: any,
  ): Promise<{ cleaned: number }> {
    const expiredSessions = await this.getExpiredSessions();
    let cleanedCount = 0;

    for (const session of expiredSessions) {
      try {
        if (cognitoService) {
          try {
            await cognitoService.revokeToken(session.refreshToken);
          } catch (error) {
            this.logger.warn(
              `Failed to revoke Cognito token for session ${session.id}:`,
              error,
            );
          }
        }

        if (apiKeyService && session.user) {
          try {
            await apiKeyService.revokeAllUserApiKeys(session.user.id);
          } catch (error) {
            this.logger.warn(
              `Failed to revoke API keys for user ${session.user.id}:`,
              error,
            );
          }
        }

        await this.revokeSession(session.id);
        cleanedCount++;

        this.logger.log(
          `Cleaned up expired session ${session.id} for user ${session.user?.email || 'unknown'}`,
        );
      } catch (error) {
        this.logger.error(`Failed to clean session ${session.id}:`, error);
      }
    }

    return { cleaned: cleanedCount };
  }
}
