import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './interfaces/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Users } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

const SALT_ROUNDS: number = 4;

@Injectable()
export class UserService {
  constructor(
    // private readonly databaseHelper: DatabaseHelper,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  getHello(): any {
    return { msg: 'Hi Everyone!!!' };
  }

  getAll(): Promise<Users[]> {
    return this.userRepository.find();
  }

  async getUser(id: number): Promise<Users> {
    return this.userRepository.findOneBy({ userID: id });
  }

  async createUser(user: CreateUserDTO): Promise<number> {
    try {
      const newUser: Users = new Users();
      newUser.email = user.Email;
      newUser.userName = user.Name;
      newUser.userPassword = await bcrypt.hashSync(user.Password, SALT_ROUNDS);

      const result: Users = await this.userRepository.save(newUser);
      return result.userID;
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  }
}
