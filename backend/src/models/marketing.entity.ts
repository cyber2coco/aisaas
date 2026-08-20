import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('marketing_contents')
export class MarketingContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  scene: string; // promotion, new_product, activity, brand

  @Column({ length: 50 })
  platform: string; // douyin, xiaohongshu, wechat, taobao

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 36 })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;
}