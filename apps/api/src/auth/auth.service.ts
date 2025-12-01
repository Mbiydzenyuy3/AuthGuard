/* eslint-disable no-unused-vars */
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { CognitoService } from './cognito/cognito.service';
import { SessionService } from '../user/session.service';
import { ApiKeyService } from '../user/api-key.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly cognito: CognitoService,
    private readonly sessionService: SessionService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  async signup(email: string, password: string) {
    try {
      const resp = await this.cognito.signUp(email, password);
      return {
        message: 'User registered successfully',
        userConfirmed: (resp as any).UserConfirmed,
      };
    } catch (err: unknown) {
      const e = err as Error;
      throw new BadRequestException(e.message || 'Signup failed');
    }
  }

  async confirmSignup(email: string, code: string) {
    try {
      await this.cognito.confirmSignUp(email, code);
      return { message: 'User confirmed successfully' };
    } catch (err: unknown) {
      const e = err as Error;
      throw new BadRequestException(e.message || 'Confirmation failed');
    }
  }
  async login(email: string, password: string) {
    try {
      const resp = await this.cognito.login(email, password);
      return (resp as any).AuthenticationResult;
    } catch (err: unknown) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  async forgotPassword(email: string) {
    try {
      const resp = await this.cognito.forgotPassword(email);
      return {
        message: 'Password reset code sent',
        deliveryDetails: (resp as any).CodeDeliveryDetails,
      };
    } catch (err: unknown) {
      const e = err as Error;
      throw new BadRequestException(e.message || 'Failed to send reset code');
    }
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    try {
      await this.cognito.ResetPassword(email, code, newPassword);
      return { message: 'Password has been reset successfully' };
    } catch (err: unknown) {
      const e = err as Error;
      throw new BadRequestException(e.message || 'Password reset failed');
    }
  }

  async changePassword(
    accessToken: string,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
      await this.cognito.changePassword(
        accessToken,
        currentPassword,
        newPassword,
      );
      return { message: 'Password has been changed successfully' };
    } catch (err: unknown) {
      const e = err as Error;
      throw new BadRequestException(e.message || 'Password change failed');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const session =
        await this.sessionService.getSessionByRefreshToken(refreshToken);
      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isExpired = await this.sessionService.isSessionExpired(session.id);
      if (isExpired) {
        await this.sessionService.cleanExpiredSessions(
          this.cognito,
          this.apiKeyService,
        );
        throw new UnauthorizedException(
          'Session has expired. Please login again.',
        );
      }

      const resp = await this.cognito.refreshToken(refreshToken);

      session.refreshToken = (resp as any).RefreshToken;
      await this.sessionService.updateSessionActivity(session.id);

      return (resp as any).AuthenticationResult;
    } catch (err: unknown) {
      const e = err as Error;

      if (!e.message?.includes('Session has expired') && refreshToken) {
        try {
          await this.sessionService.revokeSessionByToken(refreshToken);
          const session =
            await this.sessionService.getSessionByRefreshToken(refreshToken);
          if (session?.user?.id) {
            await this.apiKeyService.revokeAllUserApiKeys(session.user.id);
          }
        } catch (_sessionErr) {}
      }

      throw new UnauthorizedException(e.message || 'Token refresh failed');
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.sessionService.revokeSessionByToken(refreshToken);

      try {
        await this.cognito.revokeToken(refreshToken);
      } catch (_cognitoErr) {}

      return { message: 'Logged out successfully' };
    } catch (err: unknown) {
      const e = err as Error;
      throw new BadRequestException(e.message || 'Logout failed');
    }
  }

  async cleanupExpiredSessions(): Promise<{ cleaned: number }> {
    return this.sessionService.cleanExpiredSessions(
      this.cognito,
      this.apiKeyService,
    );
  }

  async forceLogoutUser(userId: string): Promise<void> {
    try {
      await this.sessionService.revokeAllUserSessions(userId);

      await this.apiKeyService.revokeAllUserApiKeys(userId);

      this.logger.log(`Forced logout completed for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to force logout user ${userId}:`, error);
      throw error;
    }
  }
}
