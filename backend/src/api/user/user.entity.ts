import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  userID: number;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  userPassword: string;
}
