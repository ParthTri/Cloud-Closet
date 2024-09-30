// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   ManyToOne,
//   JoinColumn,
//   ManyToMany,
// } from 'typeorm';
// import { User } from '../user/user.entity';
// import { Image } from '../image/image.entity';
// @Entity()
// export class Category {
//   @PrimaryGeneratedColumn()
//   categoryID: bigint;

//   @Column()
//   name: string;

//   // @ManyToOne(() => User, (user) => user.categories)
//   // @JoinColumn({ name: 'userID' })
//   // user: User;

//   @ManyToMany(() => Image, (image) => image.categories)
//   images: Image[];
// }
