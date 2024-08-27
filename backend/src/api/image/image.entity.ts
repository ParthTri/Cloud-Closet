import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
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

  @CreateDateColumn({ type: 'datetime' })
  createdDate: Date;

  @ManyToOne(() => User, (user) => user.images)
  @JoinColumn({ name: 'userID' })
  user: User;
}
