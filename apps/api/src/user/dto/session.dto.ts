import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken: string;

  @ApiPropertyOptional({ description: 'User agent string' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'IP address' })
  @IsOptional()
  @IsString()
  ipAddress?: string;
}

export class SessionResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  userAgent: string;

  @ApiProperty()
  @IsString()
  ipAddress: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export class RevokeSessionDto {
  @ApiProperty({ description: 'Session ID to revoke' })
  @IsUUID()
  sessionId: string;
}

export class RevokeAllSessionsDto {
  @ApiProperty({
    description: 'Confirm revoke all sessions',
    example: 'CONFIRM',
  })
  @IsString()
  confirm: string;
}
