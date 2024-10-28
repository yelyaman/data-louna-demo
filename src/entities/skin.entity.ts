import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Skin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  marketHashName: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @ManyToMany(() => User, (user) => user.skins)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
