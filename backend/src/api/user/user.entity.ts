import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Image } from '../image/image.entity';
import { Category } from '../category/category.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userID: string;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  userPassword: string;

  @OneToMany(() => Image, (image) => image.user)
  images: Image[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];
}
