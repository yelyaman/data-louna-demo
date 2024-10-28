import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { User } from './user.entity';
  
  @Entity()
  export class Skin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    market_hash_name: string

    @Column()
    price: number

    @Column()
    quantity: number;

    @ManyToMany(() => User, user => user.skins)
    users: User[]
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  }