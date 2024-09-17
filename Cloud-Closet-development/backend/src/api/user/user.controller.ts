import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './interfaces/create-user.dto';
import { User } from './user.entity';
import { UserSignIn } from './interfaces/userSigin.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // Create a new user
  @Post()
  create(@Body() body: CreateUserDTO): Promise<any> {
    return this.userService.createUser(body);
  }

  @Get(':id')
  getUserID(@Param() params: any): Promise<User> {
    return this.userService.getUser(params.id);
  }

  @Get()
  getUser(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Post('/signin')
  async signIn(@Body() userData: UserSignIn): Promise<boolean> {
    return this.userService.authenticateUser(userData);
  }
}
