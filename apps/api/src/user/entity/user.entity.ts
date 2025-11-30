import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Session } from './session.entity';
import { ApiKey } from './api-key.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name?: string;

  @Column({ unique: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ unique: true })
  cognitoSub: string;

  @Column({ default: 'developer' })
  role: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions?: Session[];

  @OneToMany(() => ApiKey, (apiKey) => apiKey.user)
  apiKeys?: ApiKey[];
}
