import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
