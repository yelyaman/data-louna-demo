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
import { UserItem as UserItem } from './user-item.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Balance, (balance) => balance.user)
  @JoinColumn()
  balance: Balance;

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserItem, (item) => item.user)
  items: UserItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
