import { Injectable } from '@nestjs/common';
import { UserDTO } from './interfaces/user.dto';
import { users } from 'src/dummydata';
import { CreateUserDTO } from './interfaces/create-user.dto';
import { DatabaseHelper } from 'src/database.helper';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS: number = 4;

@Injectable()
export class UserService {
  constructor(private readonly databaseHelper: DatabaseHelper) {}

  getHello(): any {
    return { msg: 'Hi Everyone!!!' };
  }

  getAll(): UserDTO[] {
    return users;
  }

  async getUser(id: number): Promise<UserDTO> {
    const foundUser: UserDTO = {
      ID: 0,
      Name: '',
      Email: '',
      Password: '',
    };
    const query = `SELECT userID, userName, email FROM Users WHERE userID=${id}`;

    const res = await this.databaseHelper.queryDatabase(query);

    if (res.length > 0) {
      // console.log(typeof res[0]);
      foundUser.ID = res[0]['userID'];
      foundUser.Email = res[0]['email'];
      foundUser.Name = res[0]['userName'];
    }
    return foundUser;
  }

  async createUser(user: CreateUserDTO): Promise<number> {
    try {
      const newUser: UserDTO = {
        Name: user.Name,
        Email: user.Email,
        Password: user.Password,
      };

      newUser.Password = await bcrypt.hashSync(newUser.Password, SALT_ROUNDS);

      const query: string = `INSERT INTO Users (userName, email, userPassword) VALUES (
        '${newUser.Name}', 
        '${newUser.Email}', 
        '${newUser.Password}'
      )`;

      const res = await this.databaseHelper.queryDatabase(query);
      if (res['rowsAffected'] != null) {
        const rowsAffected: number = res['rowsAffected'].length;
        return rowsAffected;
      }
    } catch (e) {
      console.log(e.message);
      throw e;
    }
    return 0;
  }
}
