import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SessionsController } from './sessions.controller';
import { ApiKeysController } from './api-keys.controller';
import { User } from './entity/user.entity';
import { Session } from './entity/session.entity';
import { ApiKey } from './entity/api-key.entity';
import { SessionService } from './session.service';
import { ApiKeyService } from './api-key.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, ApiKey]), ConfigModule],
  controllers: [UsersController, SessionsController, ApiKeysController],
  providers: [UsersService, SessionService, ApiKeyService],
  exports: [UsersService, SessionService, ApiKeyService],
})
export class UsersModule {}
