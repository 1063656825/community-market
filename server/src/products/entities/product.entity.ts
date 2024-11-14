import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('t_products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2, name: 'original_price' })
  originalPrice: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'discount_price' })
  discountPrice: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column('date', {
    nullable: false,
    default: () => 'CURRENT_DATE',
    name: 'valid_date'
  })
  validDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 