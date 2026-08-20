import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ default: 'merchant' })
  role: string;

  @Column({ unique: true, length: 36 })
  tenantId: string;

  @Column({ default: 0 })
  aiCallCount: number;

  @Column({ default: 1000 })
  aiCallLimit: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}