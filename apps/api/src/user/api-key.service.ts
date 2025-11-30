import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entity/api-key.entity';
import { User } from './entity/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeysRepo: Repository<ApiKey>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  generateApiKey(): string {
    // Generate a UUID-based API key for better uniqueness and security
    const uuid = randomUUID();
    return `ak_${uuid}`;
  }

  async createApiKey(userId: string, name?: string): Promise<ApiKey> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingKey = await this.apiKeysRepo.findOne({ where: { name } });
    if (existingKey) {
      throw new BadRequestException('API key with this name already exists');
    }

    const apiKey = this.apiKeysRepo.create({
      user,
      key: this.generateApiKey(),
      name: name || `API Key ${new Date().toISOString()}`,
    });

    return this.apiKeysRepo.save(apiKey);
  }

  async getApiKeysByUserId(userId: string): Promise<ApiKey[]> {
    return this.apiKeysRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getApiKeyById(id: string): Promise<ApiKey | null> {
    return this.apiKeysRepo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async getApiKeyByKey(key: string): Promise<ApiKey | null> {
    return this.apiKeysRepo.findOne({
      where: { key },
      relations: ['user'],
    });
  }

  async revokeApiKey(id: string): Promise<void> {
    const result = await this.apiKeysRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('API key not found');
    }
  }

  async updateLastUsed(id: string): Promise<ApiKey> {
    const apiKey = await this.getApiKeyById(id);
    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    apiKey.lastUsed = new Date();
    return this.apiKeysRepo.save(apiKey);
  }

  async getValidApiKey(key: string): Promise<ApiKey | null> {
    const apiKey = await this.getApiKeyByKey(key);
    if (!apiKey) {
      return null;
    }

    await this.updateLastUsed(apiKey.id);
    return apiKey;
  }

  async revokeAllUserApiKeys(userId: string): Promise<void> {
    await this.apiKeysRepo.delete({ user: { id: userId } });
  }

  async validateApiKey(key: string): Promise<boolean> {
    const apiKey = await this.getApiKeyByKey(key);
    return !!apiKey;
  }
}
