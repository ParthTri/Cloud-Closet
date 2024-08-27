import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  imageID: number;

  @Column()
  rawUrl: string;

  @Column()
  processedUrl: string;

  @Column({ type: 'datetime' })
  @CreateDateColumn()
  date: string;

  @ManyToOne(() => User, (user) => user.images)
  user: User;
}
