import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';

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

  @ManyToMany(() => Category, (category) => category.images)
  @JoinTable({
    name: 'ImageCategory',
    joinColumn: { name: 'imageID' },
    inverseJoinColumn: { name: 'categoryID' },
  })
  categories: Category[];
}
