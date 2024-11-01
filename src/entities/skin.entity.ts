import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserItem } from './user-item.entity';

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

  @OneToMany(() => UserItem, (item) => item.skin)
  items: UserItem[]; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
