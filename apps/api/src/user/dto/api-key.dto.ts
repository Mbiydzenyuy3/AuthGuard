import { IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiPropertyOptional({
    description: 'Name for the API key',
    maxLength: 100,
    example: 'My API Key',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}

export class ApiKeyResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'API key (masked for security)',
    example: 'ak_***************************',
  })
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastUsed: Date;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export class ApiKeyCreateResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: "The new API key (save this now, it won't be shown again)",
    example: 'ak_1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef123456',
  })
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export class RevokeApiKeyDto {
  @ApiProperty({ description: 'API key ID to revoke' })
  @IsUUID()
  apiKeyId: string;
}

export class RevokeAllApiKeysDto {
  @ApiProperty({
    description: 'Confirm revoke all API keys',
    example: 'CONFIRM',
  })
  @IsString()
  confirm: string;
}

export class ValidateApiKeyDto {
  @ApiProperty({
    description: 'API key to validate',
    example: 'ak_1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef123456',
  })
  @IsString()
  key: string;
}
