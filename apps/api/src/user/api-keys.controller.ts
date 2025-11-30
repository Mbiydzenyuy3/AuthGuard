import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { CognitoGuard } from '../auth/cognito/guard/cognito.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import {
  ApiKeyResponseDto,
  ApiKeyCreateResponseDto,
  CreateApiKeyDto,
  RevokeApiKeyDto,
  RevokeAllApiKeysDto,
} from './dto/api-key.dto';

@ApiTags('API Keys')
@ApiBearerAuth()
@Controller('api-keys')
@UseGuards(CognitoGuard)
export class ApiKeysController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiResponse({ status: 201, type: ApiKeyCreateResponseDto })
  @ApiResponse({
    status: 400,
    description: 'API key with this name already exists',
  })
  async createApiKey(@Body() body: CreateApiKeyDto, @CurrentUser() user) {
    const apiKey = await this.apiKeyService.createApiKey(user.sub, body.name);

    return {
      id: apiKey.id,
      key: apiKey.key,
      name: apiKey.name,
      createdAt: apiKey.createdAt,
      user: {
        id: apiKey.user.id,
        email: apiKey.user.email,
        name: apiKey.user.name,
      },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all user API keys' })
  @ApiResponse({ status: 200, type: [ApiKeyResponseDto] })
  async getUserApiKeys(@CurrentUser() user) {
    const apiKeys = await this.apiKeyService.getApiKeysByUserId(user.sub);
    return apiKeys.map((apiKey) => ({
      id: apiKey.id,
      key: `ak_${'*'.repeat(32)}`, // Masked for security
      name: apiKey.name,
      createdAt: apiKey.createdAt,
      lastUsed: apiKey.lastUsed,
      user: {
        id: apiKey.user.id,
        email: apiKey.user.email,
        name: apiKey.user.name,
      },
    }));
  }

  @Get(':apiKeyId')
  @ApiOperation({ summary: 'Get specific API key by ID' })
  @ApiParam({ name: 'apiKeyId', type: String })
  @ApiResponse({ status: 200, type: ApiKeyResponseDto })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async getApiKeyById(
    @Param('apiKeyId') apiKeyId: string,
    @CurrentUser() user,
  ) {
    const apiKey = await this.apiKeyService.getApiKeyById(apiKeyId);
    if (!apiKey || apiKey.user.cognitoSub !== user.sub) {
      return { message: 'API key not found' };
    }

    return {
      id: apiKey.id,
      key: `ak_${'*'.repeat(32)}`, // Masked for security
      name: apiKey.name,
      createdAt: apiKey.createdAt,
      lastUsed: apiKey.lastUsed,
      user: {
        id: apiKey.user.id,
        email: apiKey.user.email,
        name: apiKey.user.name,
      },
    };
  }

  @Delete(':apiKeyId')
  @ApiOperation({ summary: 'Revoke a specific API key' })
  @ApiParam({ name: 'apiKeyId', type: String })
  @ApiResponse({ status: 200, description: 'API key revoked successfully' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async revokeApiKey(@Param('apiKeyId') apiKeyId: string, @CurrentUser() user) {
    const apiKey = await this.apiKeyService.getApiKeyById(apiKeyId);
    if (!apiKey || apiKey.user.cognitoSub !== user.sub) {
      return { message: 'API key not found' };
    }

    await this.apiKeyService.revokeApiKey(apiKeyId);
    return { message: 'API key revoked successfully' };
  }

  @Delete()
  @ApiOperation({ summary: 'Revoke all user API keys' })
  @ApiResponse({
    status: 200,
    description: 'All API keys revoked successfully',
  })
  async revokeAllApiKeys(
    @Body() body: RevokeAllApiKeysDto,
    @CurrentUser() user,
  ) {
    if (body.confirm !== 'CONFIRM') {
      return { message: 'Confirmation required. Send {"confirm": "CONFIRM"}' };
    }

    await this.apiKeyService.revokeAllUserApiKeys(user.sub);
    return { message: 'All API keys revoked successfully' };
  }
}
