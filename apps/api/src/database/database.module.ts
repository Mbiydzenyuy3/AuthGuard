import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        // Debug logging
        console.log('=== Database Configuration Debug ===');
        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
        console.log('DB_HOST:', process.env.DB_HOST);
        console.log('DB_USERNAME:', process.env.DB_USERNAME);
        console.log('DATABASE_PASSWORD:', process.env.DATABASE_PASSWORD);
        console.log('=====================================');

        if (process.env.NODE_ENV === 'production' && process.env.DB_SECRET) {
          try {
            const dbSecret = JSON.parse(process.env.DB_SECRET);

            // Validate required fields
            if (!dbSecret.password || typeof dbSecret.password !== 'string') {
              throw new Error(
                `DB_SECRET.password must be a non-empty string. Received: ${typeof dbSecret.password}`,
              );
            }
            if (!dbSecret.username || typeof dbSecret.username !== 'string') {
              throw new Error(
                `DB_SECRET.username must be a non-empty string. Received: ${typeof dbSecret.username}`,
              );
            }

            return {
              type: 'postgres',
              host: process.env.DATABASE_HOST || dbSecret.host || 'localhost',
              port:
                parseInt(process.env.DATABASE_PORT || dbSecret.port, 10) ||
                5432,
              username: dbSecret.username,
              password: dbSecret.password,
              database:
                process.env.DATABASE_NAME || dbSecret.dbname || 'authguard_db',
              autoLoadEntities: true,
              synchronize: false,
              logging: false,
            };
          } catch (error) {
            console.error('Error parsing DB_SECRET:', error);
            throw error;
          }
        } else {
          // Support both DB_* and DATABASE_* naming conventions with fallbacks
          const password =
            process.env.DB_PASSWORD ||
            process.env.DATABASE_PASSWORD ||
            'authservice237'; // Fallback for development
          const host =
            process.env.DB_HOST || process.env.DATABASE_HOST || '127.0.0.1';
          const port = parseInt(
            process.env.DB_PORT || process.env.DATABASE_PORT || '5432',
            10,
          );
          const username =
            process.env.DB_USERNAME ||
            process.env.DATABASE_USERNAME ||
            'leilaauth'; // Fallback for development
          const database =
            process.env.DB_NAME || process.env.DATABASE_NAME || 'devguard_db';

          // Only validate if we're using environment variables, not fallbacks
          if (!process.env.DB_PASSWORD && !process.env.DATABASE_PASSWORD) {
            console.warn(
              '⚠️  Using default database credentials for development. Set DB_PASSWORD or DATABASE_PASSWORD environment variable for custom configuration.',
            );
          }

          return {
            type: 'postgres',
            host: host,
            port: port,
            username: username,
            password: password,
            database: database,
            autoLoadEntities: true,
            synchronize: false,
            logging: true,
          };
        }
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
