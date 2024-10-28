import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { Purchase } from './purchase.entity';
  
  @Entity()
  export class SkinTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'float' })
    totalAmount: number;

    @Column()
    paymentMethod: string

    @OneToOne(() => Purchase, purchase => purchase.transaction)
    purchase: Purchase
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  }