import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import { URL } from 'node:url';

interface JWK {
  kty: string;
  kid: string;
  n: string;
  e: string;
  d?: string;
  p?: string;
  q?: string;
  dp?: string;
  dq?: string;
  qi?: string;
  [key: string]: unknown;
}

interface JWKS {
  keys: JWK[];
}

@Injectable()
export class CognitoGuard implements CanActivate {
  private readonly logger = new Logger(CognitoGuard.name);
  private pems: Record<string, string> = {};
  private jwksUrl: string;
  private cacheExpiry: number = 0;
  private isRefreshing = false;

  // eslint-disable-next-line no-unused-vars
  constructor(private readonly config: ConfigService) {
    const userPoolId = this.config.get<string>('AWS_COGNITO_USER_POOL_ID');
    const region = this.config.get<string>('AWS_REGION');

    if (!userPoolId || !region) {
      throw new Error(
        'AWS_COGNITO_USER_POOL_ID and AWS_REGION must be configured',
      );
    }

    this.jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  }

  private async makeHttpRequest(
    url: string,
  ): Promise<{ statusCode: number; data: string }> {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: 'GET',
        headers: {
          'User-Agent': 'AuthGuard/1.0',
        },
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve({ statusCode: res.statusCode || 0, data });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }

  private async refreshJwks(): Promise<void> {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;

    try {
      this.logger.debug('Fetching JWKS from Cognito');
      const response = await this.makeHttpRequest(this.jwksUrl);

      if (response.statusCode !== 200) {
        throw new Error(`Failed to fetch JWKS: ${response.statusCode}`);
      }

      const jwks: JWKS = JSON.parse(response.data);

      if (!jwks.keys || !Array.isArray(jwks.keys)) {
        throw new Error('Invalid JWKS format received');
      }

      this.pems = {};
      jwks.keys.forEach((key) => {
        if (key.kid && key.n && key.e) {
          this.pems[key.kid] = jwkToPem(key as unknown as jwkToPem.JWK);
        }
      });

      this.cacheExpiry = Date.now() + 24 * 60 * 60 * 1000;
      this.logger.debug(`Loaded ${Object.keys(this.pems).length} JWKS keys`);
    } catch (error) {
      this.logger.error('Failed to fetch JWKS from Cognito:', error);

      if (Object.keys(this.pems).length === 0) {
        throw new Error('Cannot validate tokens without JWKS keys');
      }
    } finally {
      this.isRefreshing = false;
    }
  }

  private async ensureJwksLoaded(): Promise<void> {
    if (Date.now() > this.cacheExpiry || Object.keys(this.pems).length === 0) {
      await this.refreshJwks();
    }
  }

  canActivate(context: ExecutionContext): Promise<boolean> {
    return this.validateRequest(context.switchToHttp().getRequest());
  }

  private async validateRequest(request: any): Promise<boolean> {
    try {
      await this.ensureJwksLoaded();

      const authHeader = request.headers?.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('Missing authorization header');
      }

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;

      if (!token) {
        throw new UnauthorizedException('Missing token');
      }

      const decoded = jwt.decode(token, { complete: true }) as any;
      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new UnauthorizedException('Invalid token format');
      }

      const kid = decoded.header.kid;
      const pem = this.pems[kid];

      if (!pem) {
        this.logger.warn(`No PEM found for kid: ${kid}`);

        await this.refreshJwks();
        const refreshedPem = this.pems[kid];

        if (!refreshedPem) {
          throw new UnauthorizedException('Token key not found in JWKS');
        }
      }

      const verified = jwt.verify(token, pem || this.pems[kid], {
        algorithms: ['RS256'],
      });

      request.user = verified;

      this.logger.debug('Token verified successfully');
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.warn('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
