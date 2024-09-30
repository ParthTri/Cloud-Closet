import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './interfaces/create-user.dto';
import { UserSignIn } from './interfaces/userSigin.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // Create a new user
  @Post()
  create(@Body() body: CreateUserDTO): Promise<any> {
    return this.userService.createUser(body);
  }

  @Post('/signin')
  async signIn(@Body() userData: UserSignIn): Promise<any> {
    return this.userService.authenticateUser(userData);
  }
}
