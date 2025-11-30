/* eslint-disable no-unused-vars */
import {
  Controller,
  Get,
  Delete,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CognitoGuard } from '../auth/cognito/guard/cognito.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { SessionResponseDto, RevokeAllSessionsDto } from './dto/session.dto';

@ApiTags('Sessions')
@ApiBearerAuth()
@Controller('sessions')
@UseGuards(CognitoGuard)
export class SessionsController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user sessions' })
  @ApiResponse({ status: 200, type: [SessionResponseDto] })
  async getUserSessions(@CurrentUser() user) {
    const sessions = await this.sessionService.getSessionsByUserId(user.sub);
    return sessions.map((session) => ({
      id: session.id,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    }));
  }

  @Get(':sessionId')
  @ApiOperation({ summary: 'Get specific session by ID' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiResponse({ status: 200, type: SessionResponseDto })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSessionById(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user,
  ) {
    const session = await this.sessionService.getSessionById(sessionId);
    if (!session || session.user.cognitoSub !== user.sub) {
      return { message: 'Session not found' };
    }

    return {
      id: session.id,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    };
  }

  @Delete(':sessionId')
  @ApiOperation({ summary: 'Revoke a specific session' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiResponse({ status: 200, description: 'Session revoked successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async revokeSession(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user,
  ) {
    const session = await this.sessionService.getSessionById(sessionId);
    if (!session || session.user.cognitoSub !== user.sub) {
      return { message: 'Session not found' };
    }

    await this.sessionService.revokeSession(sessionId);
    return { message: 'Session revoked successfully' };
  }

  @Delete()
  @ApiOperation({ summary: 'Revoke all user sessions' })
  @ApiResponse({
    status: 200,
    description: 'All sessions revoked successfully',
  })
  async revokeAllSessions(
    @Body() body: RevokeAllSessionsDto,
    @CurrentUser() user,
  ) {
    if (body.confirm !== 'CONFIRM') {
      return { message: 'Confirmation required. Send {"confirm": "CONFIRM"}' };
    }

    await this.sessionService.revokeAllUserSessions(user.sub);
    return { message: 'All sessions revoked successfully' };
  }
}
