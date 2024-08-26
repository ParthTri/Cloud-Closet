import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
// import { UserDTO } from './interfaces/user.dto';
import { CreateUserDTO } from './interfaces/create-user.dto';
import { Users } from './user.entity';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // Create a new user
  @Post()
  create(@Body() body: CreateUserDTO): Promise<number> {
    return this.userService.createUser(body);
  }

  @Get(':id')
  getUserID(@Param() params: any): Promise<Users> {
    return this.userService.getUser(params.id);
  }

  @Get()
  getUser(): Promise<Users[]> {
    return this.userService.getAll();
  }
}
