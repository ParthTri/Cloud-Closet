import { Injectable } from '@nestjs/common';
import { UserDTO } from './interfaces/user.dto';
import { users } from 'src/dummydata';
import { CreateUserDTO } from './interfaces/create-user.dto';
import { DatabaseHelper } from 'src/database.helper';

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

  createUser(user: CreateUserDTO): number {
    const newUser: UserDTO = {
      ID: users.length + 1,
      Name: user.Name,
      Email: user.Email,
      Password: user.Password,
    };
    users.push(newUser);
    return newUser.ID;
  }
}
