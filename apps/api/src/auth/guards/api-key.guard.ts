import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ApiKeyService } from '../../user/api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Try to get API key from header first, then from query parameter
    let apiKey =
      request.headers['x-api-key'] ||
      request.headers['x-api-key'.toUpperCase()];

    if (!apiKey && request.query?.apiKey) {
      apiKey = request.query.apiKey;
    }

    if (!apiKey) {
      this.logger.warn('API key not provided');
      throw new UnauthorizedException('API key is required');
    }

    // Remove 'ak_' prefix if present for validation
    const keyToValidate = apiKey.toString().startsWith('ak_')
      ? apiKey.toString()
      : apiKey.toString();

    try {
      const validApiKey =
        await this.apiKeyService.getValidApiKey(keyToValidate);

      if (!validApiKey) {
        this.logger.warn(
          `Invalid API key provided: ${keyToValidate.substring(0, 10)}...`,
        );
        throw new UnauthorizedException('Invalid API key');
      }

      // Attach the API key to the request for further use
      request.apiKey = validApiKey;
      request.user = validApiKey.user; // Make user available via request.user

      this.logger.log(
        `API key validated successfully for user: ${validApiKey.user.email}`,
      );
      return true;
    } catch (error) {
      this.logger.error(`API key validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid API key');
    }
  }
}
