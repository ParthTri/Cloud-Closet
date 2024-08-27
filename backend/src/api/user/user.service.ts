import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './interfaces/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

const SALT_ROUNDS: number = 4;

@Injectable()
export class UserService {
  constructor(
    // private readonly databaseHelper: DatabaseHelper,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getHello(): any {
    return { msg: 'Hi Everyone!!!' };
  }

  getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUser(id: string): Promise<User> {
    return this.userRepository.findOneBy({ userID: id });
  }

  async createUser(user: CreateUserDTO): Promise<string> {
    try {
      const newUser: User = new User();
      newUser.email = user.Email;
      newUser.userName = user.Name;
      newUser.userPassword = await bcrypt.hashSync(user.Password, SALT_ROUNDS);

      const result: User = await this.userRepository.save(newUser);
      return result.userID;
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  }
}
