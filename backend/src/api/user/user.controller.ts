import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.interface';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Get(':id')
  getUserID(@Param() params: any): User[] {
    return this.userService.getUser(params.id);
  }
}
