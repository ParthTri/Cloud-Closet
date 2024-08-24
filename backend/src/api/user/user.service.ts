import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { users } from 'src/dummydata';

@Injectable()
export class UserService {
  getHello(): any {
    return { msg: 'Hi Everyone!!!' };
  }

  getUser(id: number): User[] {
    const found: User[] = users.map((user: User) => {
      if (user.ID == id) {
        return user;
      }
    });

    return found;
  }
}
