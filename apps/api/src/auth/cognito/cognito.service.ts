import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ChangePasswordCommand,
  RevokeTokenCommand,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class CognitoService {
  private readonly logger = new Logger(CognitoService.name);
  private client: CognitoIdentityProviderClient;
  private clientId: string;
  private authFlow: string;

  // eslint-disable-next-line no-unused-vars
  constructor(private readonly config: ConfigService) {
    this.client = new CognitoIdentityProviderClient({
      region: this.config.get<string>('AWS_REGION'),
      // eslint-disable-next-line no-undef
      logger: console,
    });

    this.clientId = this.config.get<string>('AWS_COGNITO_CLIENT_ID')!;
    this.authFlow =
      this.config.get<string>('AWS_COGNITO_AUTH_FLOW') || 'USER_PASSWORD_AUTH';
  }

  async signUp(email: string, password: string) {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }],
    });

    this.logger.debug(`Signing up user ${email}`);
    return this.client.send(command);
  }

  async confirmSignUp(email: string, code: string) {
    const command = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: code,
    });

    return this.client.send(command);
  }

  async login(email: string, password: string) {
    const command = new InitiateAuthCommand({
      AuthFlow: this.authFlow as AuthFlowType,
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    return this.client.send(command);
  }

  async forgotPassword(email: string) {
    const command = new ForgotPasswordCommand({
      ClientId: this.clientId,
      Username: email,
    });

    return this.client.send(command);
  }

  async ResetPassword(email: string, code: string, newPassword: string) {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });

    return this.client.send(command);
  }

  async changePassword(
    accessToken: string,
    previousPassword: string,
    proposedPassword: string,
  ) {
    const command = new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: previousPassword,
      ProposedPassword: proposedPassword,
    });

    this.logger.debug('Changing password for authenticated user');
    return this.client.send(command);
  }

  async refreshToken(refreshToken: string) {
    const command = new InitiateAuthCommand({
      AuthFlow: 'REFRESH_TOKEN_AUTH' as AuthFlowType,
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    this.logger.debug('Refreshing token');
    return this.client.send(command);
  }

  async revokeToken(refreshToken: string) {
    const command = new RevokeTokenCommand({
      ClientId: this.clientId,
      Token: refreshToken,
    });

    this.logger.debug('Revoking token');
    return this.client.send(command);
  }
}
