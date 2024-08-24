import { Injectable } from '@nestjs/common';
import { UserDTO } from './interfaces/user.dto';
import { users } from 'src/dummydata';
import { CreateUserDTO } from './interfaces/create-user.dto';

@Injectable()
export class UserService {
  getHello(): any {
    return { msg: 'Hi Everyone!!!' };
  }

  getUser(id: number): UserDTO[] {
    const found: UserDTO[] = users.map((user: UserDTO) => {
      if (user.ID == id) {
        return user;
      }
    });

    return found;
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
