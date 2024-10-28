import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { User } from './user.entity';
import { Currency } from 'src/common/enums';
  
  @Entity()
  export class Balance {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @OneToOne(() => User, user => user.balance)
    user: User;

    @Column({ type: 'float', default: 0 })
    amount: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  }