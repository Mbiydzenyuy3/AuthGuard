import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CognitoService } from './cognito/cognito.service';
import { SessionService } from '../user/session.service';
import { ApiKeyService } from '../user/api-key.service';
import { User } from '../user/entity/user.entity';
import { Session } from '../user/entity/session.entity';
import { ApiKey } from '../user/entity/api-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, ApiKey])],
  controllers: [AuthController],
  providers: [AuthService, CognitoService, SessionService, ApiKeyService],
  exports: [CognitoService],
})
export class AuthModule {}
