import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CognitoService } from './cognito/cognito.service';

@Injectable()
export class AuthService {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly cognito: CognitoService) {}

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
}
