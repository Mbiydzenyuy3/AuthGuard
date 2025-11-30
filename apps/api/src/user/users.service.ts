import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    // eslint-disable-next-line no-unused-vars
    private usersRepo: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepo.find();
  }

  findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  findByCognitoSub(sub: string) {
    return this.usersRepo.findOne({ where: { cognitoSub: sub } });
  }

  updateUser(id: string, updates: Partial<User>) {
    return this.usersRepo.update(id, updates);
  }
}
