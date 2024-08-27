import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  categoryID: bigint;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: 'userID' })
  user: User;
}
