// //user.module.ts
// import { Module } from '@nestjs/common';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';

// @Module({
//   controllers: [UserController],
//   providers: [UserService],
// })
// export class UserModule { }

import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
