 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.NODE_ENV === 'production' && process.env.DB_SECRET) {
          try {
             
            const dbSecret = JSON.parse(process.env.DB_SECRET);
            return {
              type: 'postgres',
               
              host: process.env.DATABASE_HOST || dbSecret.host,
              port:
                 
                parseInt(process.env.DATABASE_PORT || dbSecret.port, 10) ||
                5432,
              username: dbSecret.username,
              password: dbSecret.password,
              database: process.env.DATABASE_NAME || dbSecret.dbname,
              autoLoadEntities: true,
              synchronize: false, // Never use synchronize in production
              logging: false,
            };
          } catch (error) {
            console.error('Error parsing DB_SECRET:', error);
            throw error;
          }
        } else {
          // Development configuration
          return {
            type: 'postgres',
            host: process.env.DATABASE_HOST || 'localhost',
            port: parseInt(process.env.DATABASE_PORT || '5432', 10),
            username: process.env.DATABASE_USERNAME || 'postgres',
            password: process.env.DATABASE_PASSWORD || 'postgres',
            database: process.env.DATABASE_NAME || 'devguard',
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
