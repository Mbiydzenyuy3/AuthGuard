import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Repository } from 'typeorm';
import { User } from './user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth(): Promise<{ status: string; db: string }> {
    try {
      await this.userRepository.query('SELECT 1');
      return { status: 'ok', db: 'connected' };
    } catch (error) {
      return { status: 'error', db: error.message };
    }
  }
}
