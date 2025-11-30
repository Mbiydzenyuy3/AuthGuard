import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
