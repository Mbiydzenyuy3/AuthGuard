import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Session } from '../user/entity/session.entity';
import { ApiKey } from '../user/entity/api-key.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5243', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Session, ApiKey],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
});
