import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Balance } from './balance.entity';
import { Purchase } from './purchase.entity';
import { Skin } from './skin.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Balance, balance => balance.user)
  @JoinColumn()
  balance: Balance;

  @OneToMany(() => Purchase, purchase => purchase.user)
  purchases: Purchase[]

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Skin, skin => skin.users)
  skins: Skin[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}