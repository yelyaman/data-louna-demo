import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { SkinTransaction } from './transaction.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.purchases)
  user: User;

  @Column()
  skinId: string;

  @Column()
  quantity: number;

  @OneToOne(() => SkinTransaction, (transaction) => transaction.purchase)
  @JoinColumn()
  transaction: SkinTransaction;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
