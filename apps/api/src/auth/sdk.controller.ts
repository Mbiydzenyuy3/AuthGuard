import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiKeyGuard } from './guards/api-key.guard';
import { CurrentUser } from './current-user.decorator';

@ApiTags('SDK Integration')
@ApiBearerAuth('api-key')
@Controller('sdk')
@UseGuards(ApiKeyGuard)
export class SdkController {
  @Get('status')
  @ApiOperation({
    summary: 'Check SDK status',
    description:
      'Verify that the SDK integration is working properly by returning user information associated with the API key.',
  })
  @ApiResponse({
    status: 200,
    description: 'SDK is working correctly',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  async getStatus(@CurrentUser() user: any) {
    return {
      status: 'ok',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Post('user-info')
  @ApiOperation({
    summary: 'Get user information',
    description:
      'Returns detailed user information associated with the provided API key.',
  })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            cognitoSub: { type: 'string' },
            role: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  async getUserInfo(@CurrentUser() user: any) {
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        cognitoSub: user.cognitoSub,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }
}
