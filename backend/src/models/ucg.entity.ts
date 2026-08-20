import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('ucg_contents')
export class UcgContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column({ length: 50 })
  type: string; // buyer_show, video_script, review, qa

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 36 })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;
}