import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseHelper } from 'src/database.helper';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, DatabaseHelper],
})
export class UserModule {}
